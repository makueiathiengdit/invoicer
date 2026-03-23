import React from "react";
import InvoiceTable from "./invoice-table";
import { getInvoiceAll } from "@/actions/invoice";

const InvoiceWrapper = async () => {
  let invoices = [];

  try {
    let res = await getInvoiceAll();
    res = JSON.parse(res);

    if (res._success) {
      invoices = res._data;
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
