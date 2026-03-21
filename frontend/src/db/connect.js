import mongoose from "mongoose";
const connection = {
  is_connected: false,
};
export async function connectToDB() {
  console.log("Trying to connect to db...");
  try {
    if (connection.is_connected) {
      console.log("DB already connected.");
      return;
    } else {
      let db_url = null;
      if (process.env.NODE_ENV == "development") {
        db_url = process.env.LOCAL_DB_URL;
      } else {
        db_url = process.env.MONGO_DB_URL;
      }
      const db = await mongoose.connect(db_url, {
        connectTimeoutMS: 60000,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 1000 * 60 * 110,
      });
      connection.is_connected = db.connections[0].readyState;
      console.log("DB connected");
    }
  } catch (error) {
    console.log("Error while trying to connect to db");
    console.log(error);
  }
}
