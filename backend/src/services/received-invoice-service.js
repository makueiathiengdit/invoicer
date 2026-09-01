import { INVOICE_STATUS } from "../constants/constants.js";
import { Invoice, ReceivedInvoice } from "../db/models.js";

/*
  receiving an invoice moves money against the parent invoice (matched on PO)
  and closes it once the full quoted amount has been paid.
*/
export async function createReceivedInvoice(r_invoice, received_by = null) {
  const db_invoice = await Invoice.findOne({
    po_number: r_invoice.po_number,
    is_deleted: false,
  });

  if (!db_invoice) {
    return { received: null, message: "no invoice found for that PO number" };
  }

  const outstanding = db_invoice.amount - db_invoice.amount_paid;

  // invoice already paid cannot receive any further
  if (outstanding <= 0) {
    return { received: null, message: "invoice payment already cleared" };
  }

  if (r_invoice.amount > outstanding) {
    return {
      received: null,
      message: `amount exceeds the outstanding balance of ${outstanding}`,
    };
  }

  const db_received = await ReceivedInvoice.create({
    ...r_invoice,
    invoice: db_invoice._id,
    received_by,
  });

  db_invoice.amount_paid += r_invoice.amount;

  // check if invoice can be marked complete
  if (db_invoice.amount_paid >= db_invoice.amount) {
    db_invoice.status = INVOICE_STATUS.COMPLETED;
    db_invoice.completed_date = new Date();
  }

  await db_invoice.save();

  return { received: db_received, message: "invoice received successfully" };
}

export async function getReceivedInvoices(filter = {}) {
  return ReceivedInvoice.find({ is_deleted: false, ...filter }).sort({
    createdAt: -1,
  });
}

export async function getReceivedInvoicesByPO(po_number) {
  return getReceivedInvoices({ po_number });
}
