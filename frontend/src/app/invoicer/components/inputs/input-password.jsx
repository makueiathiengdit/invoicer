"use client";

import React, { useState } from "react";
// Optional: You can use Lucide-react for icons if you have it installed
// import { Eye, EyeOff } from "lucide-react";

const InputPassword = ({
  label = "Label",
  id,
  name,
  value,
  placeholder,
  error_message,
  onChange,
  hint = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-8 w-full">
      <label
        htmlFor={id}
        className="mb-1 md:mb-2 block text-sm md:text-base md:font-medium text-gray-600"
      >
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-1 px-2 pr-10 text-sm placeholder:text-sm md:py-2 md:px-4 md:text-base md:font-medium text-[#6B7280] outline-none focus:border-[#5791ee] focus:shadow-md transition-all"
          placeholder={placeholder}
        />

        <button
          type="button"
          onClick={togglePassword}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {showPassword ? (
            <span className="text-xs font-bold">Hide</span>
          ) : (
            <span className="text-xs font-bold">Show</span>
          )}
        </button>
      </div>

      {error_message ? (
        <small className="text-xs text-red-500 mt-1 block">
          {error_message}
        </small>
      ) : (
        <small className="text-xs text-gray-500 mt-1 block">{hint}</small>
      )}
    </div>
  );
};

export default InputPassword;
