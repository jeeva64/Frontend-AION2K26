import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Brochure",
  description:
    "View the official AION 2K26 invitation and download the symposium rules and event schedule.",
};

const GLASS_CARD =
  "rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-[10px] transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]";

const GRADIENT_TEXT =
  "bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] bg-clip-text text-transparent";

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
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            AION <span className={GRADIENT_TEXT}>2K26</span> Resources
          </h1>
          <p className="mx-auto max-w-2xl text-slate-300">
            View the official invitation and download symposium rules and event
            schedule
          </p>
        </div>

        <div className="grid items-start gap-10 md:grid-cols-2">
          <div className={cn(GLASS_CARD, "text-center")}>
            <h3 className="mb-4 text-2xl font-bold">🎫 Invitation</h3>

            <div className="mb-6 overflow-hidden rounded-xl border border-white/10">
              <Image
                src="/aion2k26-invitation.jpg"
                alt="AION 2K26 Invitation"
                width={600}
                height={900}
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            <a
              href="/aion2k26-invitation.jpg"
              download
              className="inline-block rounded-full bg-purple-600 px-6 py-2 font-semibold text-white shadow-md transition hover:bg-purple-700"
            >
              ⬇ Download Invitation
            </a>
          </div>

          <div className={GLASS_CARD}>
            <h3 className="mb-6 text-center text-2xl font-bold">📄 Downloads</h3>

            <div className="space-y-5">
              <Link
                href="/aion-2k26-overall-rules.pdf"
                download
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <div>
                  <p className="text-lg font-semibold">Rules &amp; Regulations</p>
                  <p className="text-sm text-slate-400">Complete symposium rules</p>
                </div>
                <span className="text-xl text-blue-400">⬇</span>
              </Link>

              <Link
                href="/aion-2k26-schedule.pdf"
                download
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <div>
                  <p className="text-lg font-semibold">Event Schedule</p>
                  <p className="text-sm text-slate-400">Full day-wise program</p>
                </div>
                <span className="text-xl text-green-400">⬇</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
