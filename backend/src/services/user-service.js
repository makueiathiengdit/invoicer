import { User } from "../db/models.js";
import { hashPassword } from "./auth-service.js";

export async function createUser(user) {
  const db_user = await User.create({
    ...user,
    password: await hashPassword(user.password),
  });

  return db_user;
}

export async function getUsers(filter = { is_deleted: false }) {
  return User.find(filter).sort({ createdAt: -1 });
}

export async function getUserById(id) {
  return User.findById(id);
}

export async function getUserByEmail(email) {
  return User.findOne({ email: String(email).toLowerCase() });
}
