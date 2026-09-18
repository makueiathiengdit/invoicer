import React from "react";
import Link from "next/link";
import { USER_ROLES } from "@/app/constants/constants";
import { getSession } from "@/lib/api-server";

/*
  the middleware already turns non-admins away from /i/users, so this is the
  second lock rather than the first — it covers the case where that matcher is
  edited and this page is forgotten. neither of them is the real one: the api
  refuses to hand a role to a caller who is not an admin.
*/
const AdminOnly = async ({ children }) => {
  const session = await getSession();

  if (session?.role !== USER_ROLES.ADMIN) {
    return (
      <div className="card w-full lg:w-1/2 bg-white shadow-sm rounded-md mt-8 mx-auto">
        <div className="card-body">
          <h2 className="text-lg font-semibold text-gray-700">
            Administrators only
          </h2>
          <p className="text-sm text-gray-500">
            Managing users needs an admin account. Ask one of your admins if you
            need access.
          </p>
          <div className="flex justify-end">
            <Link href="/i/invoices" className="btn btn-sm btn-soft rounded">
              Back to invoices
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminOnly;
