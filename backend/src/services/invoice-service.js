import { INVOICE_STATUS, USER_ROLES } from "../constants/constants.js";
import { Attachment, Invoice, User } from "../db/models.js";

/*
  invoices are handed to processors round robin: pick the processor that is not
  the one the most recent invoice went to.
*/
export function getAssignedUser(last_assigned_user, users) {
  let assigned_user = last_assigned_user;

  for (const user of users) {
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

async function nextProcessor() {
  const users = await User.find({
    role: USER_ROLES.PROCESSOR,
    is_deleted: false,
  });

  const last_invoice = await Invoice.findOne({})
    .populate("assigned_to")
    .sort({ createdAt: -1 });

  if (!last_invoice && users.length === 0) {
    return null;
  }

  const last_assigned_user = last_invoice
    ? last_invoice.assigned_to
    : users[0] || null;

  return getAssignedUser(last_assigned_user, users);
}

export async function createInvoice({ attachment, ...invoice }) {
  const assigned_user = await nextProcessor();

  if (!assigned_user) {
    return { invoice: null, message: "no invoice processors found" };
  }

  // the attachment arrives base64 encoded in the json body
  const db_attachment = await Attachment.create({
    name: attachment.name,
    size: attachment.size,
    file_type: attachment.file_type || "application/pdf",
    file: Buffer.from(attachment.file, "base64"),
  });

  try {
    const db_invoice = await Invoice.create({
      ...invoice,
      assigned_to: assigned_user._id,
      attachment: db_attachment._id,
    });

    return { invoice: db_invoice, message: "invoice created successfully" };
  } catch (error) {
    // don't leave the file behind if the invoice itself could not be written
    await Attachment.findByIdAndDelete(db_attachment._id);
    throw error;
  }
}

export async function getInvoices(filter = {}) {
  return Invoice.find({ is_deleted: false, ...filter }).sort({ createdAt: -1 });
}

export async function getInvoiceById(id) {
  // lean() skips the toJSON transforms, so drop the heavy/secret fields here
  return Invoice.findById(id)
    .populate("attachment", "-file")
    .populate("assigned_to", "-password")
    .lean();
}

export async function getInvoicesByPO(po_number) {
  return Invoice.find({ po_number, is_deleted: false });
}

export async function updatePRPO(id, prpo, processed_by = null) {
  const db_invoice = await Invoice.findById(id);

  if (!db_invoice) {
    return null;
  }

  if (prpo.pr_number) {
    db_invoice.pr_number = prpo.pr_number;
    db_invoice.pr_date = new Date();
    db_invoice.status = INVOICE_STATUS.PARTIAL;
  }

  if (prpo.po_number) {
    db_invoice.po_number = prpo.po_number;
    db_invoice.po_date = new Date();
    db_invoice.status = INVOICE_STATUS.PROCESSED;
  }

  if (processed_by) {
    db_invoice.processed_by = processed_by;
  }

  await db_invoice.save();

  return db_invoice;
}
