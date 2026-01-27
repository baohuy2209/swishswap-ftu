// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const PROTECTED_ROUTES = ["/market", "/sell"];
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session")?.value ?? null;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  /* =====================
     AUTH GUARD
  ====================== */
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  /* =====================
     SLIDING SESSION (GET)
  ====================== */
  if (request.method === "GET" && session) {
    const response = NextResponse.next();
    response.cookies.set("session", session, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  /* =====================
     CSRF PROTECTION
  ====================== */
  if (request.method !== "GET") {
    const originHeader = request.headers.get("Origin");
    const hostHeader = request.headers.get("Host");

    if (!originHeader || !hostHeader) {
      return new NextResponse(null, { status: 403 });
    }

    let origin: URL;
    try {
      origin = new URL(originHeader);
    } catch {
      return new NextResponse(null, { status: 403 });
    }

    if (origin.host !== hostHeader) {
      return new NextResponse(null, { status: 403 });
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/market/:path*", "/sell/:path*"],
};
