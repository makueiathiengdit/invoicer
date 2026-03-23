"use server";

import { ServerActionResponse } from "@/app/utils/server-action-response";
import { USER_ROLES } from "@/constants/constants";
import { connectToDB } from "@/db/connect";
import { Invoice, User } from "@/db/models";

export async function createInvoice(invoice) {
  let response = new ServerActionResponse();

  try {
    await connectToDB();

    // get users/proccessors
    const users = await User.find({
      role: USER_ROLES.PROCESSOR,
    });

    // get last invoice user
    const last_invoice = await Invoice.findOne({})
      .populate("assigned_to")
      .sort({ createdAt: -1 });

    // if no processors
    if (!last_invoice && !users) {
      response.message = "no invoice processors found";
      return JSON.stringify(response);
    }

    let last_assigned_user = null;

    // if this is first invoice and there users
    if (!last_invoice && users.length > 0) {
      last_assigned_user = users[0];
    }

    // if there is already invoice
    if (last_invoice) {
      last_assigned_user = last_invoice.assigned_to;
    }

    // get assigned user
    const assigned_user = get_assigned_user(last_assigned_user, users);

    // set assigned user
    invoice.assigned_to = assigned_user._id;

    // now create invoice
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

function get_assigned_user(last_assigned_user, users) {
  let assigned_user = last_assigned_user;

  for (let user of users) {
    if (last_assigned_user && user._id === last_assigned_user._id) {
      continue;
    }
    assigned_user = user;
  }

  return assigned_user;
}
