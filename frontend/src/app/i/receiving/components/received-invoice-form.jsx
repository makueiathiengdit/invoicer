import React from "react";
import InputText from "../../components/inputs/input-text";

const ReceivedInvoiceForm = ({ invoice = {} }) => {
  return (
    <div className="mt-4">
      <InputText label="Receipt Number" placeholder={"e.g 6798"} />
    </div>
  );
};

export default ReceivedInvoiceForm;
