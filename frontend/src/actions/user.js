"use server";

import { ServerActionResponse } from "@/app/utils/server-action-response";
import { connectToDB } from "@/db/connect";
import { User } from "@/db/models";

export async function createUser(user) {
  let response = new ServerActionResponse();

  try {
    await connectToDB();

    const db_user = await User.create(user);

    if (db_user) {
      response.success = true;
      response.message = "user created successfully";
    } else {
      response.message = "failed to create user";
    }
  } catch (error) {
    response.message = "something went wrong (500)";
  }

  return JSON.stringify(response);
}
export async function updateUser(id, user_data) {}
export async function getUserByID(id) {}
export async function getUserByEmail(email) {}
export async function getUsersAll(
  filter = {
    is_deleted: false,
  },
) {
  let response = new ServerActionResponse();

  try {
    await connectToDB();
    const users = await User.find(filter);

    if (users && users.length > 0) {
      response.success = true;
      response.message = "found users";
      response.data = users;
    } else {
      response.message = "no users found";
      response.status_code = 404;
    }
  } catch (error) {
    response.message = "someething went wrong (500)";
  }

  return JSON.stringify(response);
}
