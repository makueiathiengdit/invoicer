import { Router } from "express";
import { USER_ROLES } from "../constants/constants.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { CreateUserSchema, UpdateUserRoleSchema } from "../schemas/schemas.js";
import {
  countAdmins,
  createUser,
  getUserById,
  getUsers,
  updateUserRole,
} from "../services/user-service.js";
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

/*
  promoting a user to PROCESSOR (or ADMIN) and back. admin only, and fenced so
  the last way in cannot be closed from here:

  - an admin cannot change their own role, which is the easy way to lock
    yourself out of the screen you are standing on.
  - the final admin cannot be demoted by anyone, which would leave an install
    with nobody who can hand out roles — back to `npm run create-admin`.
*/
router.patch(
  "/:id/role",
  requireRole(USER_ROLES.ADMIN),
  validateBody(UpdateUserRoleSchema),
  asyncHandler(async (req, res) => {
    const db_user = await getUserById(req.params.id);

    if (!db_user || db_user.is_deleted) {
      return fail(res, { message: "no user found", status: 404 });
    }

    if (db_user.id === req.user.user_id) {
      return fail(res, {
        message: "you cannot change your own role",
        status: 409,
      });
    }

    const { role } = req.body;

    if (db_user.role === role) {
      return ok(res, {
        message: `${db_user.email} is already ${role}`,
        data: [db_user],
      });
    }

    if (db_user.role === USER_ROLES.ADMIN && (await countAdmins()) <= 1) {
      return fail(res, {
        message: "this is the last admin — promote someone else first",
        status: 409,
      });
    }

    const updated_user = await updateUserRole(db_user.id, role);

    return ok(res, {
      message: `${updated_user.email} is now ${role}`,
      data: [updated_user],
    });
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
