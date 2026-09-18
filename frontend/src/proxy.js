import { NextResponse } from "next/server";
import { USER_ROLES } from "@/app/constants/constants";
import { readSession } from "@/lib/session";

// this our gateman to check if user is logged in or not
export async function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const user = readSession(token);

  // If user is logged in and trying to access the login page, redirect to /i/invoices
  if (user && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(routeTo(request, "/i/invoices"));
  }

  // For protected routes, redirect unauthenticated users to login which is /
  if (!user && isProtectedRoute(request.nextUrl.pathname)) {
    const loginUrl = routeTo(request, "/");
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // user administration is an admin-only corner of the dashboard
  if (
    isAdminRoute(request.nextUrl.pathname) &&
    user?.role !== USER_ROLES.ADMIN
  ) {
    return NextResponse.redirect(routeTo(request, "/i/invoices"));
  }

  return NextResponse.next();
}

/*
  paths in here are app paths, the way nextUrl.pathname reports them — with no
  basePath on the front. cloning nextUrl carries the basePath back into the
  redirect; `new URL(path, request.url)` would drop it and send the browser to a
  404 on a deployment served under one.
*/
function routeTo(request, pathname) {
  const url = request.nextUrl.clone();

  url.pathname = pathname;
  url.search = "";

  return url;
}

function isProtectedRoute(pathname) {
  return ["/i", "/account"].some((route) => pathname.startsWith(route));
}

function isAdminRoute(pathname) {
  return pathname.startsWith("/i/users");
}

export const config = {
  matcher: ["/", "/i/:path*", "/account/:path*"],
};
