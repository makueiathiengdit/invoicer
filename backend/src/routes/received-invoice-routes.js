import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { CreateReceivedInvoiceSchema } from "../schemas/schemas.js";
import {
  createReceivedInvoice,
  getReceivedInvoices,
  getReceivedInvoicesByPO,
} from "../services/received-invoice-service.js";
import { asyncHandler, fail, ok } from "../utils/api-response.js";
import { validateBody } from "../utils/validate.js";

const router = Router();

router.use(requireAuth);

router.post(
  "/",
  validateBody(CreateReceivedInvoiceSchema),
  asyncHandler(async (req, res) => {
    const { received, message } = await createReceivedInvoice(
      req.body,
      req.user.user_id,
    );

    if (!received) {
      return fail(res, { message, status: 409 });
    }

    return ok(res, { message, data: [received], status: 201 });
  }),
);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const received_invoices = await getReceivedInvoices();

    return ok(res, {
      message: "found received invoices",
      data: received_invoices,
    });
  }),
);

router.get(
  "/po/:po_number",
  asyncHandler(async (req, res) => {
    const received_invoices = await getReceivedInvoicesByPO(
      req.params.po_number,
    );

    return ok(res, {
      message: "found received invoices",
      data: received_invoices,
    });
  }),
);

export default router;
