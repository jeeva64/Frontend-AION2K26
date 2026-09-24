import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/brochure", label: "Brochure" },
  { href: "/contact", label: "Contact" },
  { href: "/register", label: "Register" },
  { href: "/login", label: "Login" },
];

const EVENT_DETAILS = [
  "October 7, 2026 · Wednesday",
  "Sail Hall, Arrupe Library",
  "8 Events · ₹200 Entry",
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-sm font-semibold tracking-wider text-blue-400 uppercase">
      {children}
    </h3>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white">
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/60 to-purple-500/60"
      />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-2xl font-extrabold tracking-tight">
              AION<span className="text-blue-400"> 2K26 2.0</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              State Level Technical Symposium
              <br />
              Department of Artificial Intelligence
              <br />
              <a
                href="https://www.sjctni.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 transition hover:text-blue-400"
              >
                St. Joseph&apos;s College (Autonomous), Tiruchirappalli
              </a>
            </p>
          </div>

          <div>
            <FooterHeading>Explore</FooterHeading>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 transition hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>Event</FooterHeading>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {EVENT_DETAILS.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>Credits</FooterHeading>
            <p className="text-sm text-slate-300">
              Developed By
              <br />
              <a
                href="https://www.linkedin.com/in/jeeva-l/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-200 transition hover:text-blue-400"
              >
                Jeeva Loganathan (II M.Sc AI)
              </a>
              <br />
              <a
                href="tel:+919976578892"
                className="text-slate-400 transition hover:text-blue-400"
              >
                +91 99765 78892
              </a>
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          <p>© 2026 AION Symposium. All rights reserved.</p>
          <p className="mt-1">
            St. Joseph&apos;s College (Autonomous), Tiruchirappalli
          </p>
        </div>
      </div>
    </footer>
  );
}
