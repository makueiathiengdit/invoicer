import { TOKEN_COOKIE } from "../constants/constants.js";
import { verifyToken } from "../services/auth-service.js";
import { fail } from "../utils/api-response.js";

/*
  the token comes either from the httpOnly cookie (browser calls) or from an
  Authorization: Bearer header (server components forwarding a session).
*/
function readToken(req) {
  const header = req.headers.authorization || "";

  if (header.startsWith("Bearer ")) {
    return header.slice("Bearer ".length).trim();
  }

  return req.cookies?.[TOKEN_COOKIE] || null;
}

// attaches req.user when a valid token is present, never rejects
export function attachUser(req, _res, next) {
  req.user = verifyToken(readToken(req));
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return fail(res, { message: "authentication required", status: 401 });
  }

  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return fail(res, { message: "authentication required", status: 401 });
    }

    if (!roles.includes(req.user.role)) {
      return fail(res, { message: "not allowed", status: 403 });
    }

    next();
  };
}
