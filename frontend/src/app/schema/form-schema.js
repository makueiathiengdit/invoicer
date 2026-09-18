import z from "zod";
import { USER_ROLES } from "../constants/constants";

// mirrors CreateUserSchema on the api, so the form catches what it would reject
export const CreateUserFormSchema = z.object({
  first_name: z.string().min(1, "first name is required"),
  last_name: z.string().min(1, "last name is required"),
  email: z.string().min(1, "email is required").email("enter a valid email"),
  password: z.string().min(6, "password must be at least 6 characters"),
  role: z.enum(Object.values(USER_ROLES)),
});

export const InvoiceFormSchema = z.object({
  invoice_id: z.string({
    required_error: "invoice ID is required",
  }),
  // invoice_date: z.date().optional(),
  amount: z.number({
    required_error: "amount is required",
  }),
  currency: z.string({
    required_error: "currency is required",
  }),
  description: z
    .string({
      required_error: "description is required",
    })
    .min(6, "enter proper description"),
  balance: z.number().optional(),
  vendor: z
    .string({
      required_error: "vendor/subcontractor is required",
    })
    .min(3, "vendor name too short"),
  attachement: z.string().optional(),
});
