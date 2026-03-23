import React from "react";
import InvoiceDetail from "../../components/invoice-detail";
import { getInvoiceByID } from "@/actions/invoice";

const ViewInvoicePage = async ({ params }) => {
  const { id } = await params;
  let invoice = null;

  try {
    let res = await getInvoiceByID(id);
    res = JSON.parse(res);

    if (res._success) {
      invoice = res._data[0];
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
