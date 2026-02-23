import React from "react";
import ReceivedInvoiceList from "./received-invoice-list";

const ReceivedInvoiceWrapper = async () => {
  let received_invoices = [];

  try {
    const url = "http://127.0.0.1:8000/invoices/received";
    let res = await fetch(url);
    res = await res.json();

    console.log("response ", res);

    if (res.success) {
      received_invoices = res.data;
    }
  } catch (error) {}

  return (
    <div>
      <ReceivedInvoiceList data={received_invoices} />
    </div>
  );
};

export default ReceivedInvoiceWrapper;
