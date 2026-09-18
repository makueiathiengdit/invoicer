/*
  one-off bootstrap for the very first admin account.

    cd backend
    npm run create-admin                                  # prompts for everything
    npm run create-admin -- --email you@example.com ...   # or pass it all in

  sign up through the api always lands as a plain USER — only an admin may hand
  out a role — so a fresh database has no way in. this closes that loop from the
  server shell instead of opening a public endpoint.

  NODE_ENV decides which database it talks to, exactly like the api does:
  MONGO_DB_URL in production, LOCAL_DB_URL otherwise. on the deployed box run it
  as `NODE_ENV=production npm run create-admin` or the admin lands in the wrong
  database.
*/

import readline from "node:readline";
import { USER_ROLES } from "../constants/constants.js";
import { config } from "../config/env.js";
import { connectToDB, disconnectFromDB } from "../db/connect.js";
import { User } from "../db/models.js";
import { CreateUserSchema } from "../schemas/schemas.js";
import { hashPassword } from "../services/auth-service.js";
import { createUser, getUserByEmail } from "../services/user-service.js";

const FLAG_ALIASES = {
  "first-name": "first_name",
  "last-name": "last_name",
};

// --email you@example.com | --email=you@example.com | --force
function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (!arg.startsWith("--")) {
      continue;
    }

    const [raw_key, inline_value] = arg.slice(2).split(/=(.*)/s);
    const key = FLAG_ALIASES[raw_key] || raw_key;

    if (inline_value !== undefined) {
      args[key] = inline_value;
      continue;
    }

    const next = argv[i + 1];

    if (next && !next.startsWith("--")) {
      args[key] = next;
      i++;
    } else {
      args[key] = true;
    }
  }

  return args;
}

function ask(question, { mask = false } = {}) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  if (mask) {
    // keep the typed password off the screen, but still echo the prompt itself
    rl._writeToOutput = (chunk) => {
      if (rl.line.length > 0 && !chunk.includes(question)) {
        return;
      }

      rl.output.write(chunk);
    };
  }

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      if (mask) {
        rl.output.write("\n");
      }

      rl.close();
      resolve(answer.trim());
    });
  });
}

/*
  a value is taken from the flag, then the environment, then the prompt. a
  non-tty (a deploy script, a pm2 hook) has nobody to prompt, so it fails loudly
  instead of hanging on stdin forever.
*/
async function resolveField(value, { question, mask = false }) {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (!process.stdin.isTTY) {
    throw new Error(
      `missing ${question.replace(/[:?]\s*$/, "")} and stdin is not a terminal to ask on`,
    );
  }

  return ask(question, { mask });
}

function maskedDbUrl(url) {
  return String(url).replace(/\/\/([^:@/]+):([^@/]+)@/, "//$1:****@");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const email = await resolveField(args.email ?? process.env.ADMIN_EMAIL, {
    question: "email: ",
  });
  const first_name = await resolveField(
    args.first_name ?? process.env.ADMIN_FIRST_NAME,
    { question: "first name: " },
  );
  const last_name = await resolveField(
    args.last_name ?? process.env.ADMIN_LAST_NAME,
    { question: "last name: " },
  );
  const password = await resolveField(
    args.password ?? process.env.ADMIN_PASSWORD,
    { question: "password (min 6 characters): ", mask: true },
  );

  const parsed = CreateUserSchema.safeParse({
    first_name,
    last_name,
    email,
    password,
    role: USER_ROLES.ADMIN,
  });

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      console.log(`${issue.path.join(".") || "input"}: ${issue.message}`);
    }

    throw new Error("invalid admin details");
  }

  console.log(`database: ${maskedDbUrl(config.db_url)}`);

  await connectToDB();

  const existing_admins = await User.countDocuments({
    role: USER_ROLES.ADMIN,
    is_deleted: false,
  });

  /*
    this exists to bootstrap an empty install. once an admin is in place the
    normal flow — an admin creating users with a role — takes over, so refuse
    unless the operator really means it.
  */
  if (existing_admins > 0 && !args.force) {
    console.log(
      `${existing_admins} admin account(s) already exist. re-run with --force to add or promote another.`,
    );
    return;
  }

  const db_user = await getUserByEmail(parsed.data.email);

  // an account already on this email cannot be created twice — promote it
  if (db_user) {
    db_user.role = USER_ROLES.ADMIN;
    db_user.is_deleted = false;
    db_user.password = await hashPassword(parsed.data.password);
    db_user.first_name = parsed.data.first_name;
    db_user.last_name = parsed.data.last_name;

    await db_user.save();

    console.log(
      `promoted ${db_user.email} to ${USER_ROLES.ADMIN} and reset the password`,
    );
    return;
  }

  const created = await createUser(parsed.data);

  console.log(`created ${USER_ROLES.ADMIN} ${created.email}`);
}

main()
  .catch((error) => {
    console.log(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectFromDB();
  });
