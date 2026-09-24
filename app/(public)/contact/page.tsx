import type { Metadata } from "next";
import { ExternalLink, Phone } from "lucide-react";

import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the staff incharge, chairman, and system admin of AION 2K26 2.0 at St. Joseph's College (Autonomous), Tiruchirappalli.",
  alternates: {
    canonical: "/contact",
  },
};

const GLASS_CARD =
  "rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-[10px]";

const MAP_SRC =
  "https://www.google.com/maps?q=St.%20Joseph%27s%20College%20Tiruchirappalli&output=embed";
const MAP_LINK = "https://maps.app.goo.gl/tfLssgZkGV4i1Wtz7";

const CONTACTS = [
  {
    role: "Staff Incharge",
    name: "Dr. J. Hirudhaya Mary Asha",
    detail: "Assistant Professor",
    phone: "+91 75023 64030",
    phoneHref: "tel:+917502364030",
    accent: "text-purple-400",
  },
  {
    role: "Chairman",
    name: "Nandakumaaran N I",
    detail: "II M.Sc AI",
    phone: "+91 90801 86740",
    phoneHref: "tel:+919080186740",
    accent: "text-blue-400",
  },
  {
    role: "System Admin",
    name: "Jeeva L",
    detail: "II M.Sc AI",
    phone: "+91 99765 78892",
    phoneHref: "tel:+919976578892",
    accent: "text-blue-400",
  },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,#1e293b_0%,#0f172a_100%)] px-6 py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 left-1/4 h-96 w-96 animate-float rounded-full bg-blue-600/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 bottom-20 h-96 w-96 animate-float-delay rounded-full bg-purple-600/20 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            Contact Us
          </span>
          <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">
            Get in{" "}
            <span className="bg-[linear-gradient(135deg,#3B82F6_0%,#8B5CF6_100%)] bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Reach the AION 2K26 2.0 team or find us on campus
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div className={cn(GLASS_CARD, "overflow-hidden p-4 sm:p-6")}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">College Campus</h2>
                <p className="text-sm text-slate-400">
                  St. Joseph&apos;s College (Autonomous), Tiruchirappalli
                </p>
              </div>
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
              >
                Open map
                <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <iframe
                src={MAP_SRC}
                title="St. Joseph's College Tiruchirappalli map"
                className="h-[380px] w-full sm:h-[440px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <div className="space-y-6">
            {CONTACTS.map((contact) => (
              <div key={contact.role} className={cn(GLASS_CARD, "p-6 sm:p-7")}>
                <p
                  className={cn(
                    "mb-2 text-sm font-semibold tracking-wider uppercase",
                    contact.accent,
                  )}
                >
                  {contact.role}
                </p>
                <h3 className="mb-1 text-xl font-bold text-white">
                  {contact.name}
                </h3>
                <p className="mb-4 text-sm text-slate-400">{contact.detail}</p>
                <a
                  href={contact.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-blue-400/40 hover:text-blue-400"
                >
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  {contact.phone}
                </a>
              </div>
            ))}

            <div className={cn(GLASS_CARD, "p-6")}>
              <p className="mb-1 text-sm font-semibold tracking-wider text-blue-400 uppercase">
                Venue
              </p>
              <p className="text-sm leading-relaxed text-slate-300">
                Sail Hall, Arrupe Library
                <br />
                St. Joseph&apos;s College (Autonomous), Tiruchirappalli
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
