import React from "react";

/*
select box options will be passed as children e.g 

 <InputSelectBox label="Gender" id="gender" name="gender" value="male" placeholder="select gender">
    <option>option 1</option>
 </InputSelectBox>

*/
const InputSelectBox = ({
  label = "Label",
  id = "unique id",
  name = "input name",
  value = "input value",
  placeholder = "placeholder",
  error_message = "",
  hint = "",
  onChange,
  className,
  children,
}) => {
  return (
    <>
      <div className="min-h-8 w-full">
        <label
          htmlFor={id}
          className="mb-1 md:mb-2 block text-sm md:text-base md:font-medium text-gray-600"
        >
          {label}
        </label>
        <select
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-1 px-2 text-sm placeholder:text-sm md:py-2 md:px-4 md:text-base md:font-medium text-[#6B7280] outline-none  focus:border-teal-600 focus:shadow-md"
          placeholder={placeholder}
        >
          {children}
        </select>
        {error_message ? (
          <small className="text-xs text-red-500">{error_message}</small>
        ) : (
          <small className="text-xs text-gray-500">{hint}</small>
        )}
      </div>
    </>
  );
};

export default InputSelectBox;
