import { Router } from "express";
import {
  clearTokenCookie,
  createToken,
  setTokenCookie,
  tokenPayloadFor,
  verifyPassword,
} from "../services/auth-service.js";
import { getUserByEmail } from "../services/user-service.js";
import { LoginSchema } from "../schemas/schemas.js";
import { asyncHandler, fail, ok } from "../utils/api-response.js";
import { validateBody } from "../utils/validate.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post(
  "/login",
  validateBody(LoginSchema),
  asyncHandler(async (req, res) => {
    const db_user = await getUserByEmail(req.body.email);

    if (!db_user || db_user.is_deleted) {
      return fail(res, {
        message: "User account does not exist",
        status: 404,
      });
    }

    const password_match = await verifyPassword(
      req.body.password,
      db_user.password,
    );

    if (!password_match) {
      return fail(res, {
        message: "Incorrect username or password",
        status: 401,
      });
    }

    console.log("creating jwt token...");

    const payload = tokenPayloadFor(db_user);
    const token = createToken(payload);

    setTokenCookie(res, token);

    return ok(res, {
      message: "Login successful",
      data: [{ token, user: payload }],
    });
  }),
);

router.post("/logout", (_req, res) => {
  clearTokenCookie(res);
  return ok(res, { message: "Logout successful" });
});

router.get("/me", requireAuth, (req, res) =>
  ok(res, { message: "current user", data: [req.user] }),
);

export default router;
