import React from "react";
import InputText from "../../components/inputs/input-text";
import InputAmount from "../../components/inputs/input-amount";

const InvoiceForm = () => {
  return (
    <form className="p-4">
      <InputText
        label="Invoice ID"
        placeholder={"invoice id e.g INV-2026-001"}
      />
      <br />
      <InputText
        label="Description"
        placeholder={"e.g purchase of spare parts"}
      />
      <br />

      <InputAmount label={"Amount "} placeholder={"e.g 10000"} />

      <div className="flex justify-end mt-4 gap-2 ">
        <button className="btn btn-sm btn-soft">Cancel</button>
        <button className="btn btn-sm bg-teal-600 text-white">Cancel</button>
      </div>
    </form>
  );
};

export default InvoiceForm;
