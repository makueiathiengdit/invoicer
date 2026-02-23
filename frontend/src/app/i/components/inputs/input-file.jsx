import React from "react";

const InputFile = ({
  label = "File input",
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
      <fieldset className="fieldset">
        <legend className="mb-1 md:mb-2 block text-sm md:text-base md:font-medium text-gray-600">
          {label}
        </legend>
        <input
          type="file"
          className="file-input file-input-primary w-full rounded-md border border-[#e0e0e0]  py-1 px-2 text-sm placeholder:text-sm md:py-2 md:px-4 md:text-base md:font-medium text-[#6B7280] outline-none  focus:border-teal-600 focus:shadow-md"
          name={name}
          onChange={onChange}
        />
        <label className="text-gray-400 text-xs">Max size 4MB</label>
      </fieldset>
    </>
  );
};

export default InputFile;
