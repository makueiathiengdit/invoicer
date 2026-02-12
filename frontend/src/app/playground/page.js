import React from "react";
import BaseFormLayout from "../invoicer/components/base-form-layout";
import InvoiceForm from "../invoicer/invoices/components/invoice-form";
import InvoiceTable from "../invoicer/invoices/components/invoice-table";
import { sample_invoices } from "../data/invoices";

const Playground = () => {
  return (
    <div className="container m-4">
      {/* <BaseFormLayout title={"Invoice Form"}>
        <InvoiceForm />
      </BaseFormLayout> */}
      <InvoiceTable data={sample_invoices} />

      {/* <button className="btn btn-primary">Button </button> */}
    </div>
  );
};

export default Playground;
