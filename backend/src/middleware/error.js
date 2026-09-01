import mongoose from "mongoose";
import { fail } from "../utils/api-response.js";

export function notFound(req, res) {
  return fail(res, {
    message: `no route for ${req.method} ${req.originalUrl}`,
    status: 404,
  });
}

// eslint-disable-next-line no-unused-vars -- express needs the 4 arg signature
export function errorHandler(error, req, res, next) {
  console.log("unhandled error:", error);

  if (error instanceof mongoose.Error.CastError) {
    return fail(res, { message: `invalid ${error.path}`, status: 400 });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const errors = {};
    for (const [field, err] of Object.entries(error.errors)) {
      errors[field] = err.message;
    }
    return fail(res, { message: "validation failed", errors, status: 422 });
  }

  // duplicate key, e.g. a second user with the same email
  if (error?.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || "value";
    return fail(res, {
      message: `${field} already in use`,
      errors: { [field]: `${field} already in use` },
      status: 409,
    });
  }

  if (error?.type === "entity.too.large") {
    return fail(res, { message: "payload too large", status: 413 });
  }

  return fail(res, { message: "something went wrong (500)", status: 500 });
}
