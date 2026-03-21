import { NextResponse } from "next/server";
import { decodeToken } from "./actions/auth";

// this our gateman to check if user is logged in or not
export async function middleware(request) {
  const token = request.cookies.get("token");
  const user = await decodeToken(token);

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

function isProtectedRoute(pathname) {
  return ["/i", "/account"].some((route) => pathname.startsWith(route));
}

export const config = {
  matcher: ["/", "/i/:path*", "/account/:path*"],
};
