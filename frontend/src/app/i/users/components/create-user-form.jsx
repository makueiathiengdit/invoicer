"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import InputText from "../../components/inputs/input-text";
import InputPassword from "../../components/inputs/input-password";
import InputSelectBox from "../../components/inputs/input-select-box";
import { USER_ROLES } from "@/app/constants/constants";
import { CreateUserFormSchema } from "@/app/schema/form-schema";
import { convertZodErrorsToJSON } from "@/app/utils/utils";
import { createUser } from "@/lib/api-client";

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  role: USER_ROLES.USER,
};

const ROLE_HINTS = {
  [USER_ROLES.USER]: "records invoices",
  [USER_ROLES.PROCESSOR]: "invoices are assigned round robin to processors",
  [USER_ROLES.ADMIN]: "everything a processor can do, plus managing users",
};

/*
  the api only honours the role field when the caller's own token says ADMIN —
  everyone else is forced to USER no matter what is posted. the page around this
  form is admin-only for the same reason.
*/
const CreateUserForm = () => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const router = useRouter();

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validated_data = CreateUserFormSchema.safeParse(formData);

    if (!validated_data.success) {
      setFormErrors(convertZodErrorsToJSON(validated_data.error.issues));
      return;
    }

    try {
      setLoading(true);
      setFormErrors({});

      const res = await createUser(validated_data.data);

      if (res.success) {
        toast.success(res.message);

        setFormData(EMPTY_FORM);

        router.push("/i/users");
        router.refresh();
      } else {
        setFormErrors(res.errors || {});
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="p-4" onSubmit={handleSubmit}>
      <InputText
        label="First Name"
        name={"first_name"}
        value={formData.first_name}
        placeholder={"e.g Awet"}
        onChange={handleInputChange}
        error_message={formErrors.first_name}
      />
      <br />
      <InputText
        label="Last Name"
        name={"last_name"}
        value={formData.last_name}
        placeholder={"e.g Thon"}
        onChange={handleInputChange}
        error_message={formErrors.last_name}
      />
      <br />
      <InputText
        label="Email"
        name={"email"}
        value={formData.email}
        placeholder={"e.g awet@awet.com"}
        onChange={handleInputChange}
        error_message={formErrors.email}
        hint={"used to sign in"}
      />
      <br />
      <InputPassword
        label="Password"
        name={"password"}
        value={formData.password}
        placeholder={"should at least 6 characters"}
        onChange={handleInputChange}
        error_message={formErrors.password}
        hint={"share it with them — they can be given a new one later"}
      />
      <br />
      <InputSelectBox
        label="Role"
        id="role"
        name="role"
        value={formData.role}
        onChange={handleInputChange}
        error_message={formErrors.role}
        hint={ROLE_HINTS[formData.role]}
      >
        {Object.values(USER_ROLES).map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </InputSelectBox>

      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          className="btn btn-sm btn-soft rounded"
          onClick={() => router.push("/i/users")}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-sm btn-primary rounded text-white"
          disabled={loading}
        >
          {loading ? <span>Creating...</span> : <span>Create</span>}
        </button>
      </div>
    </form>
  );
};

export default CreateUserForm;
