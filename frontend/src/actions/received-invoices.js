"use server";

import { ServerActionResponse } from "@/app/utils/server-action-response";
import { Invoice, ReceivedInvoice } from "@/db/models";
import { connectToDB } from "../db/connect";
import { INVOICE_STATUS } from "@/constants/constants";

export async function createReceivedInvoice(r_invoice) {
  let response = new ServerActionResponse();

  try {
    await connectToDB();

    let db_invoice = await Invoice.findOne({
      po_number: r_invoice.po_number,
    });

    // invoice already paid canoot receive any further
    if (parseInt(db_invoice.amount) - parseInt(db_invoice.amount_paid) <= 0) {
      response.message = "invoice payment already cleared";
      return JSON.stringify(response);
    }

    // receive invoice
    db_invoice.amount_paid =
      parseInt(db_invoice.amount_paid) + parseInt(r_invoice.amount);

    // check if invoice can be mark complete
    if (db_invoice.amount === db_invoice.amount_paid) {
      db_invoice.status = INVOICE_STATUS.COMPLETED;
      db_invoice.completed_date = new Date();
    }

    // create received invoice
    let db_recieved = await ReceivedInvoice.create(r_invoice);

    if (db_recieved) {
      await db_invoice.save();
      response.success = true;
      response.message = "invoice received successfully";
    } else {
      response.message = "failed to record received invoice";
    }
  } catch (error) {
    response.message = "something went wrong (500)";
  }

  return JSON.stringify(response);
}

export async function getReceivedInvoiceByPO(po) {
  let response = new ServerActionResponse();

  try {
    await connectToDB();
    let db_invoices = await ReceivedInvoice.find({
      po_number: po,
    });
    if (db_invoices) {
      response.success = true;
      response.message = "found received invoices";
      response.data = db_invoices;
    } else {
      response.message = "could not find received invoices";
    }
  } catch (error) {
    response.message = "something went wrong (500)";
  }

  return JSON.stringify(response);
}

export async function getReceivedInvoicesAll() {
  let response = new ServerActionResponse();

  try {
    await connectToDB();
    let db_invoices = await ReceivedInvoice.find({}).sort({
      createdAt: -1,
    });

    if (db_invoices) {
      response.success = true;
      response.message = "found received invoices";
      response.data = db_invoices;
    } else {
      response.message = "could not find received invoices";
    }
  } catch (error) {
    response.message = "something went wrong (500)";
  }

  return JSON.stringify(response);
}
