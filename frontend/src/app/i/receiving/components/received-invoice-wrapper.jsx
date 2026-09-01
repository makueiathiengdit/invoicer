import React from "react";
import ReceivedInvoiceList from "./received-invoice-list";
import { getReceivedInvoices } from "@/lib/api-server";

const ReceivedInvoiceWrapper = async () => {
  let received_invoices = [];

  try {
    const res = await getReceivedInvoices();

    if (res.success) {
      received_invoices = res.data;
    }
  } catch (error) {
    console.log("could not load received invoices", error);
  }

  return (
    <>
      <ReceivedInvoiceList data={received_invoices} />
    </>
  );
};

export default ReceivedInvoiceWrapper;
