import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { config } from "./config/env.js";
import { attachUser } from "./middleware/auth.js";
import { errorHandler, notFound } from "./middleware/error.js";
import attachmentRoutes from "./routes/attachment-routes.js";
import authRoutes from "./routes/auth-routes.js";
import invoiceRoutes from "./routes/invoice-routes.js";
import receivedInvoiceRoutes from "./routes/received-invoice-routes.js";
import userRoutes from "./routes/user-routes.js";
import { ok } from "./utils/api-response.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.cors_origins,
      credentials: true, // the session rides in an httpOnly cookie
    }),
  );

  app.use(express.json({ limit: config.json_body_limit }));
  app.use(cookieParser());
  app.use(attachUser);

  app.get("/health", (_req, res) =>
    ok(res, { message: "ok", data: [{ status: "up" }] }),
  );

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/invoices", invoiceRoutes);
  app.use("/api/received-invoices", receivedInvoiceRoutes);
  app.use("/api/attachments", attachmentRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
