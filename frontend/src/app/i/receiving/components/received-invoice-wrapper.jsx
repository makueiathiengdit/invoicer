import React from "react";
import ReceivedInvoiceList from "./received-invoice-list";
import { getReceivedInvoicesAll } from "@/actions/received-invoices";

const ReceivedInvoiceWrapper = async () => {
  let received_invoices = [];

  try {
    let res = await getReceivedInvoicesAll();
    res = JSON.parse(res);
    if (res._success) {
      received_invoices = res._data;
    }
  } catch (error) {}

  return (
    <>
      <ReceivedInvoiceList data={received_invoices} />
    </>
  );
};

export default ReceivedInvoiceWrapper;
