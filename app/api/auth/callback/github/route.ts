// app/api/auth/callback/github/route.ts
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return Response.redirect(new URL("/login?error=no_code", req.url));
  }

  try {
    // 1. Exchange OAuth code for Access Token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    if (!tokenRes.ok) {
      return Response.redirect(new URL("/login?error=token_exchange_failed", req.url));
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return Response.redirect(new URL("/login?error=no_access_token", req.url));
    }

    // 2. Retrieve user emails from GitHub
    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Jedi-App-Tracker",
      },
    });

    if (!emailsRes.ok) {
      return Response.redirect(new URL("/login?error=email_fetch_failed", req.url));
    }

    interface GitHubEmail {
      email: string;
      primary: boolean;
      verified: boolean;
      visibility: string | null;
    }
    const emails = (await emailsRes.json()) as GitHubEmail[];
    
    // Find primary verified email or fallback to any verified or any email
    const emailObj = emails.find((e) => e.primary && e.verified) || 
                     emails.find((e) => e.verified) || 
                     emails[0];
                     
    const email = emailObj?.email;

    if (!email) {
      return Response.redirect(new URL("/login?error=no_email_provided", req.url));
    }

    // 3. Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          hashedPassword: null, // Passwordless OAuth user
        },
      });
    }

    // 4. Generate custom JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // 5. Redirect browser to client-side callback landing page
    return Response.redirect(new URL(`/auth/callback?token=${token}`, req.url));
  } catch (err) {
    console.error("OAuth Error:", err);
    return Response.redirect(new URL("/login?error=oauth_internal_error", req.url));
  }
}
