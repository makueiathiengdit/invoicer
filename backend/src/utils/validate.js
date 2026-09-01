import { fail } from "./api-response.js";

/*
  runs a zod schema over req.body and replaces it with the parsed value.
  field errors come back in the same { field: message } shape the forms use.
*/
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = {};
      for (const issue of result.error.issues) {
        errors[issue.path[0]] = issue.message;
      }

      return fail(res, {
        message: "validation failed",
        errors,
        status: 422,
      });
    }

    req.body = result.data;
    next();
  };
}
