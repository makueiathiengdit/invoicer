import React from "react";
import InvoiceTable from "./invoice-table";
import { getInvoiceAll } from "@/actions/invoice";
import { JsonWebTokenError } from "jsonwebtoken";

const InvoiceWrapper = async () => {
  let invoices = [];

  const base_url = process.env.API_BASE_URL + "/invoices/";
  try {
    // let res = await fetch(base_url);

    let res = await getInvoiceAll();
    res = JSON.parse(res);
    console.log("res", res);

    if (res._success) {
      invoices = res._data;

      console.log("response data", res);
    }
  } catch (error) {
    console.log("somethng went wrong, mate", error);
  }

  return (
    <>
      <InvoiceTable data={invoices} />
    </>
  );
};

export default InvoiceWrapper;
