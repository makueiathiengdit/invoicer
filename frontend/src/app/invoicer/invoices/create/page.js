import React from "react";
import BaseFormLayout from "../../components/base-form-layout";
import InvoiceForm from "../components/invoice-form";

const CreateInvoicePage = () => {
  return (
    <BaseFormLayout title={"invoice form"}>
      <InvoiceForm />
    </BaseFormLayout>
  );
};

export default CreateInvoicePage;
