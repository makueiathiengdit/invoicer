"use client";

import React, { useState } from "react";
import InputText from "../i/components/inputs/input-text";
import InputPassword from "../i/components/inputs/input-password";
import { createUser } from "@/actions/user";
import toast from "react-hot-toast";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      let res = await createUser(formData);
      res = JSON.parse(res);

      if (res._success) {
        toast.success(res._message);
      } else {
        toast.error(res._message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form method="POST">
      <InputText
        label="First Name"
        name={"first_name"}
        value={formData.first_name}
        placeholder={"e.g Awet"}
        onChange={handleInputChange}
      />
      <br />
      <InputText
        label="Last Name"
        name={"last_name"}
        value={formData.last_name}
        placeholder={"e.g Thon"}
        onChange={handleInputChange}
      />
      <br />
      <InputText
        label="Email"
        name={"email"}
        value={formData.email}
        placeholder={"e.g awet@awet.com"}
        onChange={handleInputChange}
      />

      <br />
      <InputPassword
        label="Password"
        name={"password"}
        value={formData.password}
        placeholder={"should at least 6 characters"}
        onChange={handleInputChange}
      />

      <div className="flex justify-end gap-2 mt-4">
        <button className="btn btn-sm btn-soft rounded">Cancel</button>
        <button
          className="btn btn-sm btn-primary rounded text-white"
          onClick={handleSubmit}
        >
          {loading ? <span>Creating...</span> : <span>Create</span>}
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
