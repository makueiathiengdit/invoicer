import { z } from "zod";
import { USER_ROLES } from "../constants/constants.js";

export const LoginSchema = z.object({
  email: z.string().min(1, "email is required").email("enter a valid email"),
  password: z.string().min(1, "password is required"),
});

export const CreateUserSchema = z.object({
  first_name: z.string().min(1, "first name is required"),
  last_name: z.string().min(1, "last name is required"),
  email: z.string().min(1, "email is required").email("enter a valid email"),
  password: z.string().min(6, "password must be at least 6 characters"),
  role: z.enum(Object.values(USER_ROLES)).optional(),
});

const AttachmentSchema = z.object({
  name: z.string().min(1, "attachment name is required"),
  size: z.number().int().positive(),
  file_type: z.string().optional(),
  file: z.string().min(1, "attachment file is required"), // base64
});

export const CreateInvoiceSchema = z.object({
  invoice_id: z.string().min(1, "invoice ID is required"),
  invoice_date: z.string().optional(),
  description: z.string().min(6, "enter proper description"),
  amount: z.number({ message: "amount is required" }).positive("amount must be greater than zero"),
  currency: z.string().min(1, "currency is required"),
  quantity: z.number().int().positive().optional(),
  vendor: z.string().min(3, "vendor name too short"),
  attachment: AttachmentSchema,
});

export const UpdatePRPOSchema = z
  .object({
    pr_number: z.string().trim().min(1).optional(),
    po_number: z.string().trim().min(1).optional(),
  })
  .refine((value) => value.pr_number || value.po_number, {
    message: "a PR or PO number is required",
    path: ["pr_number"],
  });

export const CreateReceivedInvoiceSchema = z.object({
  invoice_id: z.string().min(1, "invoice ID is required"),
  po_number: z.string().min(1, "PO number is required"),
  receipt_id: z.string().min(1, "receipt ID is required"),
  description: z.string().optional(),
  amount: z.number({ message: "amount is required" }).positive("amount must be greater than zero"),
});
