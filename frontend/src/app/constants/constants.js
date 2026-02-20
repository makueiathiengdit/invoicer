export const INVOICE_STATUS = {
  PENDING: "PENDING", // not proccessed has no pr or po number
  PARTIAL: "PARTIALLY PROCESSED", // has PR but no PO number
  PROCESSED: "PROCESSED", // has pr and po number but not received/submitted to finance
  COMPLETED: "COMPLETED", // received and submitted to finance
};
