import React from "react";
import UserTable from "./user-table";
import { getSession, getUsers } from "@/lib/api-server";

const UserWrapper = async () => {
  let users = [];

  try {
    const res = await getUsers();

    // an empty list comes back as a 404, which is not an error worth showing
    if (res.success) {
      users = res.data;
    }
  } catch (error) {
    console.log("could not load the users", error);
  }

  const session = await getSession();

  return <UserTable data={users} current_user_id={session?.user_id} />;
};

export default UserWrapper;
