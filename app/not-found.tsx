import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0f172a] px-4 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="animate-float absolute -top-[10%] -left-[10%] h-96 w-96 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-30 blur-[60px]" />
        <div className="animate-float-delay absolute -right-[10%] -bottom-[10%] h-80 w-80 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 opacity-20 blur-[60px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-orbitron text-8xl font-bold text-transparent">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold">Page Not Found</h1>
        <p className="mt-2 max-w-md text-slate-300">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium transition hover:opacity-90"
          >
            Back to Home
          </Link>
          <Link
            href="/brochure"
            className="rounded-lg border border-white/20 px-6 py-3 font-medium text-slate-200 transition hover:bg-white/10"
          >
            View Brochure
          </Link>
        </div>
      </div>
    </main>
  );
}
