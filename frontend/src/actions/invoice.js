"use server";

import { ServerActionResponse } from "@/app/utils/server-action-response";
import { connectToDB } from "@/db/connect";
import { Invoice } from "@/db/models";

export async function createInvoice(invoice) {
  let response = new ServerActionResponse();

  try {
    await connectToDB();

    db_inv = await Invoice.create(invoice);

    if (db_inv) {
      response.success = true;
      response.message = "invoice created successfully";
    } else {
      response.message = "failed to create invoice";
    }
  } catch (error) {
    response.message = "something went wrong (500)";
  }

  return JSON.stringify(response);
}
export async function updateInvoice(id, invoice_data) {}
export async function getInvoiceByID(id) {
  let response = new ServerActionResponse();

  try {
    await connectToDB();

    db_invoices = await Invoice.findById(id);
    if (db_invoices) {
      response.success = true;
      response.message = "found invoice";
      response.data = [db_invoices];
    } else {
      response.message = "no invoice found";
    }
  } catch (error) {
    response.message = "something went wrong (500)";
  }

  return JSON.stringify(response);
}
export async function getInvoiceAll(filter = {}) {
  let response = new ServerActionResponse();

  try {
    await connectToDB();

    db_invoices = await Invoice.find(filter);
    if (db_invoices && db_invoices.length > 0) {
      response.success = true;
      response.message = "found invoices";
      response.data = db_invoices;
    } else {
      response.message = "no invoices found";
    }
  } catch (error) {
    response.message = "something went wrong (500)";
  }

  return JSON.stringify(response);
}
