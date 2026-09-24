import type { Metadata } from "next";
import Image from "next/image";
import { Download, Eye } from "lucide-react";

import { cn } from "@/lib/utils";

const INVITE_PDF = "/aion-2k26-2.0-invite.pdf";
const INVITE_PREVIEW = "/aion-2k26-invite.jpg";

export const metadata: Metadata = {
  title: "Brochure",
  description:
    "View the official AION 2K26 2.0 invitation and download the symposium rules and event schedule.",
  alternates: {
    canonical: "/brochure",
  },
};

const GLASS_CARD =
  "rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-[10px] transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]";

const ORB_GRADIENTS = [
  "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
  "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
  "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
];

const PARTICLES = [
  { className: "top-[20%] left-[15%]", style: { "--tx": "50px", "--ty": "-80px" }, delay: "0s" },
  { className: "top-[40%] right-[20%]", style: { "--tx": "-60px", "--ty": "70px" }, delay: "1s" },
  { className: "bottom-[30%] left-[25%]", style: { "--tx": "40px", "--ty": "-60px" }, delay: "2s" },
  { className: "top-[60%] right-[15%]", style: { "--tx": "-50px", "--ty": "80px" }, delay: "3s" },
  { className: "bottom-[20%] left-[40%]", style: { "--tx": "70px", "--ty": "-50px" }, delay: "1.5s" },
  { className: "top-[70%] right-[35%]", style: { "--tx": "-40px", "--ty": "60px" }, delay: "2.5s" },
];

export default function BrochurePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#1e293b_0%,#0f172a_100%)] px-[clamp(1rem,3vw,1.5rem)] py-[clamp(5rem,12vh,7rem)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {ORB_GRADIENTS.map((bg, i) => (
          <div
            key={i}
            className={cn(
              "absolute rounded-full blur-[60px]",
              i === 0
                ? "-top-[10%] -left-[10%] h-[clamp(300px,50vw,600px)] w-[clamp(300px,50vw,600px)] animate-float"
                : i === 1
                  ? "-right-[10%] -bottom-[10%] h-[clamp(250px,40vw,500px)] w-[clamp(250px,40vw,500px)] animate-float-delay"
                  : "top-[50%] left-[50%] h-[clamp(200px,35vw,450px)] w-[clamp(200px,35vw,450px)] -translate-x-1/2 -translate-y-1/2 animate-float [animation-delay:2s]"
            )}
            style={{ background: bg, opacity: 0.4 }}
          />
        ))}
        <div className="pointer-events-none absolute inset-0">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className={cn(
                "absolute h-[clamp(4px,1vw,8px)] w-[clamp(4px,1vw,8px)] animate-particle-float rounded-full",
                p.className
              )}
              style={
                {
                  ...p.style,
                  animationDelay: p.delay,
                  background:
                    "radial-gradient(circle, #60A5FA 0%, transparent 70%)",
                  opacity: 0.3,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="mb-6 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">
            AION 2K26 2.0 Resources
          </h1>
          <p className="mx-auto max-w-2xl text-white/80">
            Official invitation and symposium downloads
          </p>
        </div>

        <div className="grid items-start gap-10 md:grid-cols-2">
          <div className={cn(GLASS_CARD, "text-center")}>
            <h3 className="mb-6 text-2xl font-bold text-white">🎫 Invitation</h3>

            <a
              href={INVITE_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-5 block overflow-hidden rounded-xl border border-white/10 bg-white/5"
            >
              <Image
                src={INVITE_PREVIEW}
                alt="AION 2K26 2.0 official invitation"
                width={1600}
                height={1086}
                className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </a>

            <p className="mb-4 text-sm text-slate-400">
              Official Invitation &middot; Preview &amp; download
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={INVITE_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                <Eye aria-hidden="true" className="h-4 w-4" />
                View PDF
              </a>
              <a
                href={INVITE_PDF}
                download
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 bg-blue-500/20 px-4 py-2.5 text-sm font-semibold text-blue-200 transition-colors hover:bg-blue-500/30"
              >
                <Download aria-hidden="true" className="h-4 w-4" />
                Download PDF
              </a>
            </div>
          </div>

          <div className={GLASS_CARD}>
            <h3 className="mb-6 text-center text-2xl font-bold text-white">📄 Downloads</h3>

            <div className="space-y-5">
              <div
                aria-disabled="true"
                className="flex cursor-not-allowed items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 opacity-70"
              >
                <div>
                  <p className="text-lg font-semibold text-white">
                    Rules &amp; Regulations
                  </p>
                  <p className="text-sm text-slate-400">Complete symposium rules</p>
                </div>
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-amber-300">
                  Coming soon
                </span>
              </div>

              <div
                aria-disabled="true"
                className="flex cursor-not-allowed items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 opacity-70"
              >
                <div>
                  <p className="text-lg font-semibold text-white">
                    Event Schedule
                  </p>
                  <p className="text-sm text-slate-400">Full day-wise program</p>
                </div>
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-amber-300">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
