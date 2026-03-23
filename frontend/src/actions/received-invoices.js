"use server";

import { ServerActionResponse } from "@/app/utils/server-action-response";
import { ReceivedInvoice } from "@/db/models";
import { connectToDB } from "../db/connect";

export async function createReceivedInvoice(r_invoice) {
  let response = new ServerActionResponse();

  try {
    await connectToDB();
    let db_recieved = await ReceivedInvoice.create(r_invoice);

    if (db_recieved) {
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

  console.log("response", response);

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
