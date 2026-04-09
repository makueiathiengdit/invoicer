"use server";

import { ServerActionResponse } from "@/app/utils/server-action-response";
import { INVOICE_STATUS, USER_ROLES } from "@/constants/constants";
import { connectToDB } from "@/db/connect";
import { Attachment, Invoice, User } from "@/db/models";

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

    // create attachement first
    // const arrayBuffer = await invoice.attachment.file.arrayBuffer();
    const buffer = Buffer.from(invoice.attachment.file, "base64");

    const attachment = new Attachment({
      size: invoice.attachment.size,
      name: invoice.attachment.name,
      file_type: invoice.attachment.file.mimetype,
      file: buffer,
    });

    // update invoice attachement to reference created attachment
    invoice.attachment = attachment._id.toString();

    // now create invoice
    const db_inv = await Invoice.create(invoice);

    if (db_inv) {
      await attachment.save();
      response.success = true;
      response.message = "invoice created successfully";
    } else {
      response.message = "failed to create invoice";
    }
  } catch (error) {
    console.log(error);

    response.message = "something went wrong (500)";
  }

  return JSON.stringify(response);
}
export async function updateInvoice(id, invoice_data) {}
export async function getInvoiceByID(id) {
  let response = new ServerActionResponse();

  try {
    await connectToDB();

    let db_inv = await Invoice.findById(id)
      .populate("attachment")
      .populate("assigned_to")
      .lean();
    if (db_inv) {
      response.success = true;
      response.message = "found invoice";
      response.data = [db_inv];
    } else {
      response.message = "no invoice found";
    }
  } catch (error) {
    console.log(error);

    response.message = "something went wrong (500)";
  }

  return JSON.stringify(response);
}
export async function getInvoiceAll(filter = {}) {
  let response = new ServerActionResponse();

  try {
    await connectToDB();

    const db_invoices = await Invoice.find(filter)
      //   .populate("attachment")
      .sort({ createdAt: -1 });
    if (db_invoices && db_invoices.length > 0) {
      response.success = true;
      response.message = "found invoices";
      response.data = db_invoices;
    } else {
      response.message = "no invoices found";
    }
  } catch (error) {
    console.log(error);

    response.message = "something went wrong (500)";
  }

  return JSON.stringify(response);
}

export async function getInvoiceByPO(po) {
  let response = new ServerActionResponse();

  try {
    await connectToDB();
    let db_invoices = await Invoice.find({
      po_number: po,
    });
    if (db_invoices) {
      response.success = true;
      response.message = "found invoices";
      response.data = db_invoices;
    } else {
      response.message = "could not find invoices";
    }
  } catch (error) {
    response.message = "something went wrong (500)";
  }

  //   console.log("response", response);

  return JSON.stringify(response);
}

export async function updatePRPO(id, prpo) {
  let response = new ServerActionResponse();

  try {
    await connectToDB();
    const db_inv = await Invoice.findById(id);

    if (db_inv) {
      if (prpo.hasOwnProperty("pr_number") && prpo.pr_number) {
        db_inv.pr_number = prpo.pr_number;
        db_inv.pr_date = new Date();
        db_inv.status = INVOICE_STATUS.PARTIAL;
      }

      if (prpo.hasOwnProperty("po_number") && prpo.po_number) {
        db_inv.po_number = prpo.po_number;
        db_inv.po_date = new Date();
        db_inv.status = INVOICE_STATUS.PROCESSED;
      }

      await db_inv.save();

      response.success = true;
      response.message = "invoice updated succesfully";
    } else {
      response.message = "cannot find invoice with id";
    }
  } catch (error) {
    response.message = "somethin wwent wrong (500)";
  }

  return JSON.stringify(response);
}

function get_assigned_user(last_assigned_user, users) {
  let assigned_user = last_assigned_user;

  for (let user of users) {
    if (
      last_assigned_user &&
      user._id.toString() === last_assigned_user._id.toString()
    ) {
      continue;
    }
    assigned_user = user;
  }

  return assigned_user;
}
