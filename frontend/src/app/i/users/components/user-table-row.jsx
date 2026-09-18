import React from "react";
import { getUserRoleColor } from "@/app/utils/utils";

const UserTableRow = ({ item = {}, is_self = false }) => {
  return (
    <tr className="border-b border-gray-300 hover:bg-emerald-50">
      <th scope="row" className="px-4 py-3 font-medium whitespace-nowrap">
        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
      </th>
      <td className="px-4 py-3">
        <span className="mr-1">
          {item.first_name} {item.last_name}
        </span>
        {is_self && <span className="text-xs text-gray-400">(you)</span>}
      </td>
      <td className="px-4 py-3">{item.email}</td>
      <td className="px-4 py-3 font-semibold">
        <span className={`${getUserRoleColor(item.role)} text-xs`}>
          {item.role || "UNKNOWN"}
        </span>
      </td>
    </tr>
  );
};

export default UserTableRow;
