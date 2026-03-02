import React from "react";
import ReceivedInvoiceList from "./received-invoice-list";
import { delayRequest } from "@/app/utils/utils";

const ReceivedInvoiceWrapper = async () => {
  let received_invoices = [];

  try {
    const url = "http://127.0.0.1:8000/received/invoices";

    await delayRequest(1200);

    let res = await fetch(url);
    res = await res.json();

    if (res.success) {
      received_invoices = res.data;
    }
  } catch (error) {}

  return (
    <>
      <ReceivedInvoiceList data={received_invoices} />
    </>
  );
};

export default ReceivedInvoiceWrapper;
