/*
  reads the jwt payload without verifying it — this only decides which screen to
  show. the express api verifies the signature on every request, so a forged
  token gets someone a redirect and nothing else.

  kept free of next imports on purpose: the middleware (edge) and the server
  components (node) both read the session through here.
*/
export function readSession(token) {
  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const user = JSON.parse(json);

    // treat an expired token as logged out
    if (user.exp && user.exp * 1000 < Date.now()) {
      return null;
    }

    return user;
  } catch (error) {
    console.log("could not read the session token", error);
    return null;
  }
}
