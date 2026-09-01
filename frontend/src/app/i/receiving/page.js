import React, { Suspense } from "react";
import ReceivedInvoiceWrapper from "./components/received-invoice-wrapper";
import LoadingSpinner from "../components/spinner/loading-spinner";

// the list is fetched with the caller's session, so it can never be prerendered
export const dynamic = "force-dynamic";

const ReceivingHomePage = () => {
  return (
    <div>
      <Suspense
        fallback={<LoadingSpinner text="loading received invoices..." />}
      >
        <ReceivedInvoiceWrapper />
      </Suspense>
    </div>
  );
};

export default ReceivingHomePage;
