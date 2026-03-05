import z from "zod";

export const InvoiceFormSchema = z.object({
  invoice_id: z.string({
    required_error: "invoice ID is required",
  }),
  invoice_date: z.date().optional(),
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
