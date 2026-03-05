import z from "zod";

export const InvoiceFormSchema = z.object({
  invoice_id: z.string(),
  invoice_date: z.date(),
  amount: z.number(),
  currency: z.string(),
  description: z.string(),
  balance: z.number(),
  vendor: z.string(),
  attachement: z.string().optional(),
});
