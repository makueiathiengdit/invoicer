"use client";

import React, { useState } from "react";
import InputText from "../i/components/inputs/input-text";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    passowrd: "",
  });

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    console.log(formData);
  };

  return (
    <div>
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

      <div className="flex justify-end gap-2 mt-4">
        <button className="btn btn-sm btn-soft rounded">Cancel</button>
        <button
          className="btn btn-sm btn-primary rounded text-white"
          onClick={handleSubmit}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;
