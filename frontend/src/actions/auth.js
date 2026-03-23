"use server";

import { connectToDB } from "@/db/connect";
import { User } from "@/db/models";
import { ServerActionResponse } from "@/app/utils/server-action-response";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// auth server actions

// create hashed value of a given password
export async function hashPassword(password) {
  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(password, salt);
  return hash;
}

// check if given password and its hashed password are same
export async function verifyPassword(password, hash) {
  const match = await bcryptjs.compare(password, hash);
  return match;
}

// create jwt token from payload
export async function createToken(payload) {
  let token = null;
  let error = null;
  try {
    token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });
  } catch (err) {
    console.log("Error creating token", err);

    error = err;
  }
  return token;
}

// decode jwt token to js object
export async function decodeToken(token) {
  let user = null;
  let error = null;

  if (!token) {
    return null;
  }
  if (typeof token == "object") {
    token = token.value;
  }
  try {
    user = jwt.decode(token, process.env.JWT_SECRET);
  } catch (err) {
    error = err;
  }

  return user;
}
export const login = async (user) => {
  let response = new ServerActionResponse();

  try {
    await connectToDB();

    let db_user = await User.findOne({ email: user.email });

    if (!db_user) {
      response.success = false;
      response.message = "User account does not exist";
      response.status_code = 404;
    } else {
      const password_match = await verifyPassword(
        user.password,
        db_user.password,
      );
      if (!password_match) {
        response.success = false;
        response.message = "Incorrect username or password";
      } else {
        console.log("creating jwt token...");

        let payload = {
          name: db_user.first_name,
          full_name: db_user.first_name + " " + db_user.last_name,
          user_id: db_user._id.toString(),
          email: db_user.email,
          role: db_user.role,
          //   region: db_user.region,
        };

        let jwt_token = await createToken(payload);

        let user_cookie = await cookies();
        user_cookie.set("token", jwt_token, {
          maxAge: 60 * 60 * 4, // expires in 4hrs
        });

        response.success = true;
        response.message = "Login successful";
        response.data = [jwt_token];
        // for log message
        const log_payload = {
          user: db_user.email,
          operation: "LOGIN",
          url: "/",
          message: "USER LOGIN SUCCESSFUL",
        };
      }
    }
  } catch (error) {
    console.log("error", error);

    response.success = false;
    response.message = "Something went wrong while trying to login.";
    response.status_code = 500;
  }

  return JSON.stringify(response);
};

export const logout = async () => {
  const user_cookie = await cookies();
  let message = "";
  let response = {
    success: false,
    message: "",
  };
  try {
    user_cookie.set("token", "");
    response["success"] = true;
    response["message"] = "Logout successful";
  } catch (error) {
    response["message"] = "Failed to logout";
    console.log(error);
  }

  return response;
};
