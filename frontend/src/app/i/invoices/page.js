import React, { Suspense } from "react";
import InvoiceWrapper from "./components/invoice-wrapper";
import LoadingSpinner from "../components/spinner/loading-spinner";

// the list is fetched with the caller's session, so it can never be prerendered
export const dynamic = "force-dynamic";

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
