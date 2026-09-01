import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { CreateInvoiceSchema, UpdatePRPOSchema } from "../schemas/schemas.js";
import {
  createInvoice,
  getInvoiceById,
  getInvoices,
  getInvoicesByPO,
  updatePRPO,
} from "../services/invoice-service.js";
import { asyncHandler, fail, ok } from "../utils/api-response.js";
import { validateBody } from "../utils/validate.js";

const router = Router();

router.use(requireAuth);

router.post(
  "/",
  validateBody(CreateInvoiceSchema),
  asyncHandler(async (req, res) => {
    const { invoice, message } = await createInvoice(req.body);

    if (!invoice) {
      return fail(res, { message, status: 409 });
    }

    return ok(res, { message, data: [invoice], status: 201 });
  }),
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.assigned_to) {
      filter.assigned_to = req.query.assigned_to;
    }

    const invoices = await getInvoices(filter);

    if (invoices.length === 0) {
      return fail(res, { message: "no invoices found", status: 404 });
    }

    return ok(res, { message: "found invoices", data: invoices });
  }),
);

router.get(
  "/po/:po_number",
  asyncHandler(async (req, res) => {
    const invoices = await getInvoicesByPO(req.params.po_number);

    if (invoices.length === 0) {
      return fail(res, { message: "could not find invoices", status: 404 });
    }

    return ok(res, { message: "found invoices", data: invoices });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const invoice = await getInvoiceById(req.params.id);

    if (!invoice || invoice.is_deleted) {
      return fail(res, { message: "no invoice found", status: 404 });
    }

    return ok(res, { message: "found invoice", data: [invoice] });
  }),
);

router.patch(
  "/:id/prpo",
  validateBody(UpdatePRPOSchema),
  asyncHandler(async (req, res) => {
    const invoice = await updatePRPO(req.params.id, req.body, req.user.user_id);

    if (!invoice) {
      return fail(res, { message: "cannot find invoice with id", status: 404 });
    }

    return ok(res, {
      message: "invoice updated succesfully",
      data: [invoice],
    });
  }),
);

export default router;
