/*
  every endpoint answers with the same envelope:
  { success, message, data, errors }
*/

export function apiResponse({
  success = false,
  message = "",
  data = [],
  errors = {},
} = {}) {
  return {
    success,
    message,
    data: Array.isArray(data) ? data : [data],
    errors,
  };
}

export function ok(res, { message = "", data = [], status = 200 } = {}) {
  return res
    .status(status)
    .json(apiResponse({ success: true, message, data }));
}

export function fail(
  res,
  { message = "", errors = {}, status = 400, data = [] } = {},
) {
  return res
    .status(status)
    .json(apiResponse({ success: false, message, data, errors }));
}

/*
  express 5 forwards rejected promises to the error handler on its own, but
  wrapping keeps the intent obvious at every route definition.
*/
export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
