import React, { Suspense } from "react";
import ReceivedInvoiceWrapper from "./components/received-invoice-wrapper";

const ReceivingHomePage = () => {
  return (
    <div>
      <Suspense fallback={<p>Loading received invoices</p>}>
        <ReceivedInvoiceWrapper />
      </Suspense>
    </div>
  );
};

export default ReceivingHomePage;
