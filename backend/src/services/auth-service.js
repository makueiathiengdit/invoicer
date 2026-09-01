import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { TOKEN_COOKIE } from "../constants/constants.js";

// create hashed value of a given password
export async function hashPassword(password) {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

// check if given password and its hashed password are same
export async function verifyPassword(password, hash) {
  return bcryptjs.compare(password, hash);
}

// create jwt token from payload
export function createToken(payload) {
  return jwt.sign(payload, config.jwt_secret, {
    expiresIn: config.jwt_expires_in,
  });
}

// verify signature and expiry, returns null on a bad token
export function verifyToken(token) {
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, config.jwt_secret);
  } catch (error) {
    console.log("invalid token", error.message);
    return null;
  }
}

export function tokenPayloadFor(user) {
  return {
    name: user.first_name,
    full_name: `${user.first_name} ${user.last_name}`,
    user_id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
}

/*
  the token also rides in an httpOnly cookie so the next.js proxy can gate routes
  without javascript holding it.

  cookies are scoped by host and ignore the port, so the api and the app have to
  be served from the same hostname for this to work — localhost:8000 and
  localhost:3000 share the cookie, localhost and 127.0.0.1 do not. SameSite=lax
  is enough for that setup; split them across domains in production and this has
  to become SameSite=none + Secure.
*/
export function setTokenCookie(res, token) {
  res.cookie(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.cookie_secure,
    maxAge: 1000 * 60 * 60 * 4, // 4hrs
    path: "/",
  });
}

export function clearTokenCookie(res) {
  res.clearCookie(TOKEN_COOKIE, { path: "/" });
}
