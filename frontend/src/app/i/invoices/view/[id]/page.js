import React from "react";
import InvoiceDetail from "../../components/invoice-detail";
import { getInvoiceById } from "@/lib/api-server";

const ViewInvoicePage = async ({ params }) => {
  const { id } = await params;
  let invoice = null;

  try {
    const res = await getInvoiceById(id);

    if (res.success) {
      invoice = res.data[0];
    }
  } catch (error) {
    console.log(error);
  }

  return (
    <div>
      {invoice ? (
        <InvoiceDetail invoice={invoice} />
      ) : (
        <p>No invoice to view</p>
      )}
    </div>
  );
};

export default ViewInvoicePage;
