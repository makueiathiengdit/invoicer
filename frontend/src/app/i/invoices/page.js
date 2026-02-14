import React, { Suspense } from "react";
import InvoiceTable from "./components/invoice-table";
import { sample_invoices } from "@/app/data/invoices";
import InvoiceWrapper from "./components/invoice-wrapper";
const InvoicesHomePage = () => {
  return (
    <div className="">
      <Suspense fallback={<p>loading...</p>}>
        <InvoiceWrapper />
      </Suspense>
    </div>
  );
};

export default InvoicesHomePage;
