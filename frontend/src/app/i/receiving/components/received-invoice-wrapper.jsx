import { Reem_Kufi } from "next/font/google";
import React from "react";
import ReceivedInvoiceList from "./received-invoice-list";

const ReceivedInvoiceWrapper = async () => {
  let received_invoices = [];

  try {
    const url = "/";
    let res = await fetch(url);
    res = await res.json();

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
