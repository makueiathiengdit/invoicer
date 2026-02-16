import React, { Suspense } from "react";
import InvoiceTable from "./components/invoice-table";
import { sample_invoices } from "@/app/data/invoices";
import InvoiceWrapper from "./components/invoice-wrapper";
import LoadingSpinner from "../components/spinner/loading-spinner";
const InvoicesHomePage = () => {
  return (
    <div className="">
      <Suspense fallback={<LoadingSpinner text="loading invoices..." />}>
        <InvoiceWrapper />
      </Suspense>
    </div>
  );
};

export default InvoicesHomePage;
