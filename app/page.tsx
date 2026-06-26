import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900/80 text-neutral-200/80">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <h1 className="font-semibold text-2xl">Jedi</h1>
        <div className="flex gap-4 items-center justify-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:bg-primary/90"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-5xl font-semibold tracking-tight mb-4">
          Track every application.
          <br />
          Land your dream job.
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-md">
          Stop losing track of where you applied. JobTracker keeps your entire
          job search organized in one place.
        </p>
        <div className="flex gap-4">
          <Link
            href="/register"
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md hover:bg-primary/90 font-medium"
          >
            Get Started — it's free
          </Link>
          <Link
            href="/login"
            className="border px-6 py-2.5 rounded-md hover:bg-secondary font-medium"
          >
            Login
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-8 mt-24 max-w-3xl text-left">
          <div>
            <h3 className="font-medium mb-2">Track applications</h3>
            <p className="text-sm text-muted-foreground">
              Add jobs, update statuses, and never lose track of where you
              applied.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Stay organized</h3>
            <p className="text-sm text-muted-foreground">
              See your entire pipeline at a glance — applied, interviewing,
              offered, rejected.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Access anywhere</h3>
            <p className="text-sm text-muted-foreground">
              Your data lives in the cloud. Login from any device, anytime.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-muted-foreground border-t">
        Built by{" "}
        <a href="https://github.com/P-kaizoku" className="hover:underline">
          P-kaizoku
        </a>
      </footer>
    </div>
  );
}
