import React from "react";
import BaseFormLayout from "../../components/base-form-layout";
import AdminOnly from "../components/admin-only";
import CreateUserForm from "../components/create-user-form";

// the admin check reads the session cookie, so this page is per request
export const dynamic = "force-dynamic";

const CreateUserPage = () => {
  return (
    <AdminOnly>
      <BaseFormLayout title={"Create user"}>
        <CreateUserForm />
      </BaseFormLayout>
    </AdminOnly>
  );
};

export default CreateUserPage;
