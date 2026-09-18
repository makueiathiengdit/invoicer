"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { USER_ROLES } from "@/app/constants/constants";
import { getUserRoleColor } from "@/app/utils/utils";
import { updateUserRole } from "@/lib/api-client";

/*
  changing the selection saves straight away — there is only one field, so a
  save button would just be an extra click. the row keeps the new role on
  screen while the server list catches up on refresh, and rolls back if the api
  refuses (the last admin cannot be demoted, and nobody may change their own).
*/
const UserRoleSelect = ({ user_id = "", role = "", disabled = false }) => {
  const [current_role, setCurrentRole] = useState(role);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  const handleChange = async (event) => {
    const next_role = event.target.value;
    const previous_role = current_role;

    if (next_role === previous_role) {
      return;
    }

    setCurrentRole(next_role);
    setSaving(true);

    try {
      const res = await updateUserRole(user_id, next_role);

      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        setCurrentRole(previous_role);
        toast.error(res.message);
      }
    } catch (error) {
      setCurrentRole(previous_role);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (disabled) {
    return (
      <span className={`${getUserRoleColor(current_role)} text-xs font-semibold`}>
        {current_role || "UNKNOWN"}
      </span>
    );
  }

  return (
    <select
      aria-label="role"
      value={current_role}
      onChange={handleChange}
      disabled={saving}
      className={`${getUserRoleColor(current_role)} text-xs font-semibold rounded-md border border-[#e0e0e0] bg-white py-1 px-2 outline-none focus:border-teal-600 disabled:opacity-60`}
    >
      {Object.values(USER_ROLES).map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
};

export default UserRoleSelect;
