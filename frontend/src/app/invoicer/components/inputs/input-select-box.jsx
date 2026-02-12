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
          className="select focus:select-primary w-full"
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
