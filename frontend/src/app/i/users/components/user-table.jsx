import React from "react";
import Link from "next/link";
import UserTableRow from "./user-table-row";

const UserTable = ({ data = [], current_user_id = "" }) => {
  return (
    <div>
      <div className="mx-auto px-4 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className="w-full md:w-1/2">
            <h1 className="text-lg font-semibold text-gray-700">
              Users
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({data.length})
              </span>
            </h1>
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 shrink-0">
            <Link
              href={"/i/users/create"}
              className="flex items-center justify-center text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none"
            >
              <svg
                className="h-3.5 w-3.5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                />
              </svg>
              Add User
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto rounded-md shadow">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-white uppercase bg-teal-600">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Created At
                </th>
                <th scope="col" className="px-4 py-3">
                  Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Email
                </th>
                <th scope="col" className="px-4 py-3">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center">
                    no users yet
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <UserTableRow
                    item={item}
                    key={item._id}
                    is_self={item._id === current_user_id}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
