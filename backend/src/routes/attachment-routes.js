import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getAttachmentById,
  toBuffer,
} from "../services/attachment-service.js";
import { asyncHandler, fail } from "../utils/api-response.js";

const router = Router();

router.use(requireAuth);

// streams the stored file itself, so it answers with bytes and not the envelope
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const doc = await getAttachmentById(req.params.id);

    if (!doc || !doc.file || doc.is_deleted) {
      return fail(res, { message: "Attachment Not found", status: 404 });
    }

    const file = toBuffer(doc.file);

    res.setHeader("Content-Type", doc.file_type || "application/pdf");
    res.setHeader("Content-Length", file.length);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(doc.name || "attachment")}"`,
    );

    return res.send(file);
  }),
);

export default router;
