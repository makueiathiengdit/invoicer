import BaseFormLayout from "@/app/i/components/base-form-layout";
import React from "react";
import EditInvoiceForm from "../../components/edit-invoice-form";

const EditInvoicePage = async ({ params }) => {
  const { id } = await params;
  let invoice = null;
  if (id) {
    try {
      const base_url = process.env.API_BASE_URL + "/invoices/" + id;

      let res = await fetch(base_url);
      res = await res.json();

      if (res.success) {
        invoice = res.data[0];
      }
    } catch (error) {
      console.log("error while trying to fetch invoice: ", error);
    }
  }

  return (
    <div>
      <BaseFormLayout title={"Edit Invoice Form"}>
        <EditInvoiceForm invoice={invoice} />
      </BaseFormLayout>
    </div>
  );
};

export default EditInvoicePage;
