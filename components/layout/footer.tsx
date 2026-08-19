import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/brochure", label: "Brochure" },
  { href: "/register", label: "Register" },
  { href: "/login", label: "Login" },
];

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-xl font-extrabold tracking-tight">
            AION<span className="text-blue-400"> 2K26</span>
          </h3>
          <p className="text-sm text-slate-400">
            State Level Technical Symposium
          </p>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-slate-300"
          >
            {FOOTER_LINKS.map((link, index) => (
              <span key={link.href} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-slate-600" aria-hidden="true">
                    •
                  </span>
                )}
                <Link
                  href={link.href}
                  className="transition hover:text-blue-400"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>

          <div className="text-center text-sm text-slate-400">
            <p className="font-medium text-slate-300">Developed By</p>
            <p>
              Jeeva Loganathan (II M.Sc AI) ·{" "}
              <a
                href="tel:+919976578892"
                className="transition hover:text-blue-400"
              >
                +91 99765 78892
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 text-center text-sm text-slate-400">
          <p>© 2026 AION Symposium. All rights reserved.</p>
          <p className="mt-1">
            St. Joseph&apos;s College (Autonomous), Tiruchirappalli
          </p>
        </div>
      </div>
    </footer>
  );
}
