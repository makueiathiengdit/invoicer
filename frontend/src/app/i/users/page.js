import React, { Suspense } from "react";
import UserWrapper from "./components/user-wrapper";
import LoadingSpinner from "../components/spinner/loading-spinner";
import AdminOnly from "./components/admin-only";

// the list is fetched with the caller's session, so it can never be prerendered
export const dynamic = "force-dynamic";

const UsersPage = () => {
  return (
    <AdminOnly>
      <Suspense fallback={<LoadingSpinner text="loading users..." />}>
        <UserWrapper />
      </Suspense>
    </AdminOnly>
  );
};

export default UsersPage;
