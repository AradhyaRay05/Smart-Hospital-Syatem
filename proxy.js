import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "shds-default-secret-change-in-production");
const COOKIE_NAME = "shds-auth-token";

const publicPaths = ["/", "/sign-in", "/sign-up", "/forgot-password", "/reset-password", "/api/auth", "/forbidden"];

function isPublicPath(pathname) {
  return publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

async function getPayloadFromRequest(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const payload = await getPayloadFromRequest(request);

  if (!payload) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Force incomplete patient profiles to onboarding
  if (
    payload.role === "PATIENT" &&
    payload.profileComplete === false &&
    !pathname.startsWith("/complete-profile") &&
    !pathname.startsWith("/api/")
  ) {
    return NextResponse.redirect(new URL("/complete-profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
