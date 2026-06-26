// app/login/page.tsx
"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ErrorDisplay() {
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");

  if (!oauthError) return null;

  const errorMessages: Record<string, string> = {
    no_code: "GitHub did not return an auth verification code.",
    token_exchange_failed: "Failed to exchange OAuth code for access token.",
    no_access_token: "Access token request rejected by provider.",
    email_fetch_failed: "Failed to retrieve user email from provider account.",
    no_email_provided: "No verified primary email found on your GitHub profile.",
    oauth_internal_error: "An unexpected error occurred during OAuth validation.",
  };

  const msg = errorMessages[oauthError] || oauthError;

  return (
    <div className="text-xs font-mono text-red-500 dark:text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-sm leading-relaxed">
      <span className="font-bold">[ERROR // OAUTH_FAILED]:</span> {msg}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    localStorage.setItem("token", data.token);
    router.push("/dashboard");
  }

  function handleGithubSignIn(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID || "";
    const origin = window.location.origin;
    const redirectUri = encodeURIComponent(`${origin}/api/auth/callback/github`);
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
    window.location.href = url;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
      <div className="w-full max-w-md mb-6">
        <Link href="/" className="inline-flex items-center gap-2 hover:opacity-85 transition-opacity">
          <span className="font-mono text-[10px] bg-foreground/10 text-foreground px-2 py-0.5 border border-border rounded-sm uppercase tracking-wider font-semibold">
            v1.0.0
          </span>
          <span className="font-mono font-bold text-xl tracking-tight">
            JEDI<span className="animate-pulse">_</span>
          </span>
        </Link>
      </div>
      <Card className="w-full max-w-md border border-border bg-card/40 rounded-sm shadow-none">
        <CardHeader className="border-b border-border/80 pb-4">
          <CardTitle className="font-mono text-base font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Secure Access</span>
            <span className="text-muted-foreground text-[10px] font-medium tracking-normal">
              [AUTH // LOGIN]
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Email Address
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@jedi.sh"
                required
                className="rounded-sm border-border bg-background/50 focus-visible:border-foreground/30 focus-visible:ring-3 focus-visible:ring-foreground/10 placeholder:text-muted-foreground/50 font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Password
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="rounded-sm border-border bg-background/50 focus-visible:border-foreground/30 focus-visible:ring-3 focus-visible:ring-foreground/10 placeholder:text-muted-foreground/50 font-mono text-sm"
              />
            </div>

            <Suspense fallback={null}>
              <ErrorDisplay />
            </Suspense>

            {error && (
              <div className="text-xs font-mono text-red-500 dark:text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-sm leading-relaxed">
                <span className="font-bold">[ERROR // ACCESS_DENIED]:</span> {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full font-mono text-sm rounded-sm py-2 hover:bg-background hover:text-foreground border border-foreground bg-foreground text-background transition-all duration-150 cursor-pointer"
              disabled={loading}
            >
              {loading ? "AUTHENTICATING..." : "ESTABLISH_SESSION"}
            </Button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-border/50"></div>
              <span className="flex-shrink mx-4 font-mono text-[9px] text-muted-foreground uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-border/50"></div>
            </div>

            <a
              href="#"
              onClick={handleGithubSignIn}
              className="w-full inline-flex justify-center items-center gap-2 font-mono text-xs border border-border rounded-sm py-2 bg-background hover:bg-foreground/[0.02] hover:border-foreground/30 transition-all duration-150 cursor-pointer"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              SIGN_IN_WITH_GITHUB
            </a>

            <p className="text-xs text-center text-muted-foreground font-mono">
              Need account?{" "}
              <Link href="/register" className="text-foreground hover:underline font-semibold decoration-border hover:decoration-foreground underline underline-offset-4">
                REGISTER_USER
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
