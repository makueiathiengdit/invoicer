import React from "react";
import InvoiceDetail from "../../components/invoice-detail";
import { BASE_API_URL } from "@/app/constants/constants";
import { getInvoiceByID } from "@/actions/invoice";

const ViewInvoicePage = async ({ params }) => {
  const { id } = await params;
  let invoice = null;

  const base_url = BASE_API_URL + "/invoices/" + id;
  try {
    // let res = await fetch(base_url);
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
        <p>Something went wrong</p>
      )}
    </div>
  );
};

export default ViewInvoicePage;
