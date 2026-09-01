import React from "react";
import InvoiceTable from "./invoice-table";
import { getInvoices } from "@/lib/api-server";

const InvoiceWrapper = async () => {
  let invoices = [];

  try {
    const res = await getInvoices();

    if (res.success) {
      invoices = res.data;
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
