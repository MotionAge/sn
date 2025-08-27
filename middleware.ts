import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session");

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jose.jwtVerify(sessionCookie.value, secret);
    } catch (error) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/admin/login") && sessionCookie) {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jose.jwtVerify(sessionCookie.value, secret);
        return NextResponse.redirect(new URL("/admin", request.url));
    } catch (error) {
        // Invalid token, let them login again
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
