import React from "react";
import ReceivedInvoiceList from "./received-invoice-list";
import { delayRequest } from "@/app/utils/utils";
import { BASE_API_URL } from "@/app/constants/constants";

const ReceivedInvoiceWrapper = async () => {
  let received_invoices = [];

  try {
    const url = BASE_API_URL + "/received/invoices";

    await delayRequest(100);

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
