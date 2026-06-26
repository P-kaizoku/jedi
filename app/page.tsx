"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setTimeout(() => {
        setIsLoggedIn(true);
        try {
          const payloadPart = token.split(".")[1];
          if (payloadPart) {
            const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
              window.atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
            );
            const decoded = JSON.parse(jsonPayload);
            if (decoded && decoded.email) {
              setUserEmail(decoded.email);
            }
          }
        } catch (e) {
          console.error("Failed to parse token payload:", e);
        }
      }, 0);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-4 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] bg-foreground/10 text-foreground px-2 py-0.5 border border-border rounded-sm uppercase tracking-wider font-semibold">
            v1.0.0
          </span>
          <span className="font-mono font-bold text-xl tracking-tight">
            JEDI<span className="animate-pulse">_</span>
          </span>
        </div>
        <div className="flex gap-4 items-center justify-center font-mono">
          {isLoggedIn ? (
            <>
              <span className="text-xs text-muted-foreground bg-foreground/5 border border-border rounded-sm py-1.5 px-3 select-none">
                [USER // {userEmail || "LOGGED_IN"}]
              </span>
              <Link
                href="/dashboard"
                className="text-sm bg-foreground text-background border border-foreground px-4 py-1.5 rounded-sm hover:bg-background hover:text-foreground transition-all font-medium"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 px-3 rounded-sm border border-transparent hover:border-border"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm bg-foreground text-background border border-foreground px-4 py-1.5 rounded-sm hover:bg-background hover:text-foreground transition-all font-medium"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-5xl mx-auto">
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-border bg-foreground/[0.02] font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          SYSTEMS_ONLINE // TRACK_SEARCH
        </div>

        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 max-w-3xl leading-[1.1] text-balance">
          Track every application.
          <br />
          Land your dream job.
        </h2>
        
        <p className="text-muted-foreground text-base md:text-lg mb-10 max-w-lg leading-relaxed text-pretty">
          Stop losing track of where you applied. Jedi keeps your entire
          job search pipeline organized in a high-density, terminal-inspired workspace.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto font-mono">
          <Link
            href={isLoggedIn ? "/dashboard" : "/register"}
            className="bg-foreground text-background border border-foreground px-8 py-3 rounded-sm hover:bg-background hover:text-foreground transition-all font-semibold text-sm shadow-none"
          >
            {isLoggedIn ? "LAUNCH_WORKSPACE" : "INITIALIZE_TRACKING — it's free"}
          </Link>
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="border border-border bg-transparent text-foreground px-8 py-3 rounded-sm hover:bg-foreground/[0.03] hover:border-foreground/30 transition-all font-semibold text-sm"
          >
            ACCESS_DASHBOARD
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-28 w-full text-left">
          <div className="border border-border p-6 rounded-sm bg-foreground/[0.01] hover:border-foreground/20 hover:bg-foreground/[0.02] transition-all">
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-semibold">
              [01 // TRACK]
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground tracking-tight">
              Track Applications
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Log job details, links, and manage application statuses instantly without page loads.
            </p>
          </div>

          <div className="border border-border p-6 rounded-sm bg-foreground/[0.01] hover:border-foreground/20 hover:bg-foreground/[0.02] transition-all">
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-semibold">
              [02 // ORGANIZE]
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground tracking-tight">
              Visual Pipeline
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              View your entire funnel (Applied, Interviewing, Offered, Rejected) at a single glance.
            </p>
          </div>

          <div className="border border-border p-6 rounded-sm bg-foreground/[0.01] hover:border-foreground/20 hover:bg-foreground/[0.02] transition-all">
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-semibold">
              [03 // PERSIST]
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground tracking-tight">
              Keep Detailed Notes
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Document interviewer feedback, follow-up dates, and code challenge details right on the application.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs font-mono text-muted-foreground border-t border-border mt-auto">
        <span>Built by </span>
        <a
          href="https://github.com/P-kaizoku"
          className="text-foreground hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          P-kaizoku
        </a>
        <span className="mx-2">•</span>
        <span>JEDI_SYSTEMS // {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
