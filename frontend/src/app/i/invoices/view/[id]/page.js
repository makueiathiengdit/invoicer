import React from "react";
import InvoiceDetail from "../../components/invoice-detail";

const ViewInvoicePage = async ({ params }) => {
  const { id } = await params;
  let invoice = null;

  const base_url = process.env.API_BASE_URL + "/invoices/" + id;
  try {
    let res = await fetch(base_url);
    res = await res.json();

    console.log("response", res);

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
        <p>Something went wrong</p>
      )}
    </div>
  );
};

export default ViewInvoicePage;
