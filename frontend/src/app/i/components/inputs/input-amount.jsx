"use client";

import { convertAmountToWords } from "@/app/utils/utils";
import React from "react";

const InputAmount = ({
  label,
  id,
  name,
  value,
  placeholder,
  error_message,
  onChange,
  hint = "",
}) => {
  const amount_in_words = convertAmountToWords(value) || "null";
  hint = hint ? hint : "amount in words: " + amount_in_words;

  return (
    <>
      <div className="min-h-8 w-full">
        <label
          htmlFor={id}
          className="mb-1 md:mb-2 block text-sm md:text-base md:font-medium text-gray-600"
        >
          {label}
        </label>
        <input
          type="number"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-1 px-2 text-sm placeholder:text-sm md:py-2 md:px-4 md:text-base md:font-medium text-[#6B7280] outline-none  focus:border-teal-600 focus:shadow-md"
          placeholder={placeholder}
        />
        {error_message ? (
          <small className="text-xs text-red-500">{error_message}</small>
        ) : (
          <small className="text-xs text-gray-500">{hint}</small>
        )}
      </div>
    </>
  );
};

export default InputAmount;
