import React from "react";

const LoadingSpinner = ({ text = "loading..." }) => {
  return (
    <div className="flex gap-2 justify-center items-center min-h-screen">
      <span className="loading loading-spinner text-success"></span>
      <span className="text-success">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
