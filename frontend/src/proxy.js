import { NextResponse } from "next/server";

// this our gateman to check if user is logged in or not
export async function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const user = readSession(token);

  // If user is logged in and trying to access the login page, redirect to /i/invoices
  if (user && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/i/invoices", request.url));
  }

  // For protected routes, redirect unauthenticated users to login which is /
  if (!user && isProtectedRoute(request.nextUrl.pathname)) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/*
  reads the jwt payload without verifying it — this only decides which screen to
  show. the express api verifies the signature on every request, so a forged
  token gets someone a redirect and nothing else.
*/
function readSession(token) {
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

function isProtectedRoute(pathname) {
  return ["/i", "/account"].some((route) => pathname.startsWith(route));
}

export const config = {
  matcher: ["/", "/i/:path*", "/account/:path*"],
};
