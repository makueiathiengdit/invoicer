import React from "react";
import InvoiceTable from "./components/invoice-table";
import { sample_invoices } from "@/app/data/invoices";
const InvoicesHomePage = () => {
  return (
    <div className="bg-gray-50 p-3 sm:p-5">
      <InvoiceTable data={sample_invoices} />
    </div>
  );
};

export default InvoicesHomePage;
