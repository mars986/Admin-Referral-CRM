import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin/");
}

export function middleware(request: NextRequest) {
  if (!isAdminPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const accessEnforced = String(process.env.ACCESS_ENFORCED ?? "false") === "true";
  if (!accessEnforced) {
    return NextResponse.next();
  }

  const accessEmail = request.headers.get("cf-access-authenticated-user-email");
  if (!accessEmail) {
    return NextResponse.json({ ok: false, error: "Admin access required" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
