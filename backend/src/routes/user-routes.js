import { Router } from "express";
import { USER_ROLES } from "../constants/constants.js";
import { requireAuth } from "../middleware/auth.js";
import { CreateUserSchema } from "../schemas/schemas.js";
import { createUser, getUserById, getUsers } from "../services/user-service.js";
import { asyncHandler, fail, ok } from "../utils/api-response.js";
import { validateBody } from "../utils/validate.js";

const router = Router();

/*
  sign up stays open the way the old server action was, but only an admin may
  hand out a role — anyone else lands as a plain USER.
*/
router.post(
  "/",
  validateBody(CreateUserSchema),
  asyncHandler(async (req, res) => {
    const is_admin = req.user?.role === USER_ROLES.ADMIN;

    const db_user = await createUser({
      ...req.body,
      role: is_admin ? req.body.role || USER_ROLES.USER : USER_ROLES.USER,
    });

    return ok(res, {
      message: "user created successfully",
      data: [db_user],
      status: 201,
    });
  }),
);

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const filter = { is_deleted: false };

    if (req.query.role) {
      filter.role = String(req.query.role).toUpperCase();
    }

    const users = await getUsers(filter);

    if (users.length === 0) {
      return fail(res, { message: "no users found", status: 404 });
    }

    return ok(res, { message: "found users", data: users });
  }),
);

router.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const db_user = await getUserById(req.params.id);

    if (!db_user || db_user.is_deleted) {
      return fail(res, { message: "no user found", status: 404 });
    }

    return ok(res, { message: "found user", data: [db_user] });
  }),
);

export default router;
