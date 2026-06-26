// app/auth/callback/page.tsx
"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground antialiased selection:bg-foreground selection:text-background font-mono text-xs">
      <div className="flex items-center gap-2 mb-2">
        <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
        <span>SECURE_CONNECTION_ESTABLISHED</span>
      </div>
      <p className="text-muted-foreground uppercase">[FINISHING_HANDSHAKE // UPDATING_SESSION]</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground font-mono text-xs">
        [INITIALIZING_CALLBACK]
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
