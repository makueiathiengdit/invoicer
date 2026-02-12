import React from "react";

const BaseFormLayout = ({ title, children }) => {
  return (
    <>
      <div className="card w-full lg:w-5/6 bg-base-100 shadow-sm md:shadow-md rounded-md mt-8">
        <div className="p-3 md:p-4 bg-teal-500">
          <h2 className="text-white text-sm md:text-lg font-semibold md:font-bold ml-3 md:ml-4">
            {title.toUpperCase()}
          </h2>
        </div>
        <div className="card-body flex-auto justify-center">{children}</div>
      </div>
    </>
  );
};

export default BaseFormLayout;
