import { createApp } from "./app.js";
import { config } from "./config/env.js";
import { connectToDB, disconnectFromDB } from "./db/connect.js";

async function main() {
  await connectToDB();

  const server = createApp().listen(config.port, () => {
    console.log(`API listening on http://localhost:${config.port}`);
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      console.log(`${signal} received, shutting down...`);
      server.close(async () => {
        await disconnectFromDB();
        process.exit(0);
      });
    });
  }
}

main().catch((error) => {
  console.log("failed to start the api");
  console.log(error);
  process.exit(1);
});
