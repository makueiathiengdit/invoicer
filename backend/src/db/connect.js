import mongoose from "mongoose";
import { config } from "../config/env.js";

export async function connectToDB() {
  console.log("Trying to connect to db...");

  await mongoose.connect(config.db_url, {
    connectTimeoutMS: 60000,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 1000 * 60 * 110,
  });

  console.log("DB connected");
}

export async function disconnectFromDB() {
  await mongoose.connection.close();
}
