import { USER_ROLES } from "@/constants/constants";
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },

    role: {
      type: String,
      default: USER_ROLES.USER,
      uppercase: true,
    },
    password: {
      type: String,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);

const AttachmentSchema = new Schema(
  {
    name: {
      type: String,
    },
    size: {
      type: Number,
    },
    file: {
      type: Buffer,
    },
    file_type: {
      type: String,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const InvoiceSchema = new Schema(
  {
    invoice_id: {
      type: String,
    },
    invoice_date: {
      type: String,
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    amount: {
      type: Number,
      default: 0.0,
    },
    currency: {
      type: String,
    },
    vendor: {
      type: String,
    },
    attachment: {
      type: Schema.Types.ObjectId,
      ref: "Attachment",
    },
    pr_number: { type: String },
    po_number: { type: String },
    pr_date: {
      type: Date,
    },
    po_date: { type: Date },
    assigned_to: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    processed_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "PENDING",
    },
    completed_date: {
      type: Date,
    },
    amount_paid: {
      type: Number,
      default: 0,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const ReceivedInvoiceSchema = new Schema(
  {
    invoice_id: {
      type: String,
    },
    description: { type: String },
    amount: {
      type: Number,
      default: 0,
    },
    po_number: { type: String },
    receipt_id: {
      type: String,
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
    },

    received_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.models?.User || mongoose.model("User", UserSchema);
export const Attachment =
  mongoose.models?.Attachment || mongoose.model("Attachment", AttachmentSchema);
export const Invoice =
  mongoose.models?.Invoice || mongoose.model("Invoice", InvoiceSchema);
