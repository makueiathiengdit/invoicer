import React from "react";
import BaseFormLayout from "../../components/base-form-layout";
import SignUpForm from "@/app/components/sign-up-form";

const CreateUserPage = () => {
  return (
    <BaseFormLayout title={"Create user"}>
      <SignUpForm />
    </BaseFormLayout>
  );
};

export default CreateUserPage;
