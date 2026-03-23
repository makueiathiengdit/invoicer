import React from "react";
import ReceivedInvoiceList from "./received-invoice-list";
import { delayRequest } from "@/app/utils/utils";
import { BASE_API_URL } from "@/app/constants/constants";
import { getReceivedInvoicesAll } from "@/actions/received-invoices";

const ReceivedInvoiceWrapper = async () => {
  let received_invoices = [];

  try {
    // const url = BASE_API_URL + "/received/invoices";

    // let res = await fetch(url);
    // res = await res.json();

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
