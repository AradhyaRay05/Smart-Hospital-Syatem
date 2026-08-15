import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setAuthCookie } from "@/lib/auth";
import { isSuperAdminEmail } from "@/lib/auth/super-admin";

export async function GET(req) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in?error=no_code", req.url));
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(new URL("/sign-in?error=token_failed", req.url));
    }

    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/sign-in?error=no_email", req.url));
    }

    const normalizedEmail = googleUser.email.toLowerCase().trim();

    let user = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } },
      include: { doctor: true, patient: true },
    });

    if (!user) {
      const isSuperAdmin = isSuperAdminEmail(googleUser.email);
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          imageUrl: googleUser.picture,
          role: isSuperAdmin ? "SUPER_ADMIN" : "PATIENT",
          profileComplete: true,
          ...(isSuperAdmin
            ? {}
            : {
                patient: {
                  create: {
                    firstName: googleUser.given_name || "Patient",
                    lastName: googleUser.family_name || "",
                    gender: "OTHER",
                    dateOfBirth: new Date("2000-01-01"),
                    phone: "0000000000",
                  },
                },
              }),
        },
        include: { patient: true },
      });
    }

    await setAuthCookie(user.id, user.email, user.role, user.profileComplete);

    const target =
      user.role === "PATIENT" && !user.profileComplete
        ? "/complete-profile"
        : "/dashboard";

    return NextResponse.redirect(new URL(target, req.url));
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(new URL("/sign-in?error=oauth_failed", req.url));
  }
}
