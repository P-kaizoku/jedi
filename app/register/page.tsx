// app/register/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
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

    router.push("/login");
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
            <span>Create Profile</span>
            <span className="text-muted-foreground text-[10px] font-medium tracking-normal">
              [AUTH // REGISTER]
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

            {error && (
              <div className="text-xs font-mono text-red-500 dark:text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-sm leading-relaxed">
                <span className="font-bold">[ERROR // CREATION_FAILED]:</span> {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full font-mono text-sm rounded-sm py-2 hover:bg-background hover:text-foreground border border-foreground bg-foreground text-background transition-all duration-150 cursor-pointer"
              disabled={loading}
            >
              {loading ? "INITIALIZING..." : "REGISTER_USER"}
            </Button>

            <p className="text-xs text-center text-muted-foreground font-mono">
              Have an account?{" "}
              <Link href="/login" className="text-foreground hover:underline font-semibold decoration-border hover:decoration-foreground underline underline-offset-4">
                LOGIN_SESSION
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
