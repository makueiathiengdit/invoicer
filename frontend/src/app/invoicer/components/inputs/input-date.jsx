import React from "react";

const InputDate = ({
  label = "Label",
  id,
  name,
  value,
  placeholder,
  error_message,
  onChange,
  hint = "",
}) => {
  return (
    <>
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-muted-foreground"
        >
          {label}
        </label>
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="DD/MM/YYYY"
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-1 px-2 text-sm placeholder:text-sm md:py-2 md:px-4 md:text-base md:font-medium text-[#6B7280] outline-none  focus:border-[#5791ee] focus:shadow-md"
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

export default InputDate;
