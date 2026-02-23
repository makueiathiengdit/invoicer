import React, { Suspense } from "react";
import ReceivedInvoiceWrapper from "./components/received-invoice-wrapper";
import LoadingSpinner from "../components/spinner/loading-spinner";

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
