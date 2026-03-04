import React from "react";
import InvoiceTable from "./invoice-table";

const InvoiceWrapper = async () => {
  let invoices = [];

  const base_url = process.env.API_BASE_URL + "/invoices/";
  try {
    let res = await fetch(base_url);

    res = await res.json();

    if (res.success) {
      invoices = res.data;
    }
  } catch (error) {}

  return (
    <>
      <InvoiceTable data={invoices} />
    </>
  );
};

export default InvoiceWrapper;
