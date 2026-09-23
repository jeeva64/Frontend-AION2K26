import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

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

export function AuthHeroBackground() {
  return (
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
                background: "radial-gradient(circle, #60A5FA 0%, transparent 70%)",
                opacity: 0.3,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}

const HIGHLIGHTS = ["8 Events", "₹200 Entry", "1 Day"];

function BrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between gap-8 overflow-hidden bg-[linear-gradient(160deg,#0f172a_0%,#1e293b_45%,#1e3a8a_100%)] p-8 text-white lg:col-span-2 lg:flex">
      <div
        aria-hidden="true"
        className="animate-float pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-500 opacity-20 blur-[70px]"
      />
      <div
        aria-hidden="true"
        className="animate-float-delay pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-purple-500 opacity-20 blur-[70px]"
      />

      <Image
        src="/logo-v2.png"
        alt="AION 2K26 2.0"
        width={1665}
        height={945}
        priority
        className="relative w-32"
        style={{ height: "auto" }}
      />

      <div className="relative space-y-4">
        <h2 className="text-xl font-bold leading-snug">
          State Level Technical Symposium
        </h2>
        <p className="text-sm leading-relaxed text-slate-300">
          Department of Artificial Intelligence
          <br />
          St. Joseph&apos;s College (Autonomous), Tiruchirappalli
        </p>
        <div className="space-y-2 pt-1 text-sm text-slate-300">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-blue-400" />
            October 7, 2026 · Wednesday
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-blue-400" />
            Sail Hall, Arrupe Library
          </p>
        </div>
      </div>

      <div className="relative flex flex-wrap gap-2">
        {HIGHLIGHTS.map((label) => (
          <span
            key={label}
            className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-xs font-semibold backdrop-blur-sm"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function BrandBanner() {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4 lg:hidden">
      <Image
        src="/logo-v2.png"
        alt="AION 2K26 2.0"
        width={1665}
        height={945}
        priority
        className="h-9 shrink-0"
        style={{ width: "auto" }}
      />
      <p className="min-w-0 text-xs font-medium leading-snug text-slate-500">
        State Level Technical Symposium
        <br />
        Oct 7, 2026 · St. Joseph&apos;s College
      </p>
    </div>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <section className="relative flex min-h-[calc(100svh-3.5rem)] items-start justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#1e293b_0%,#0f172a_100%)] px-4 pt-[calc(3.5rem+1.5rem)] pb-10 sm:px-6 sm:pt-[calc(3.5rem+2.5rem)] sm:pb-14">
      <AuthHeroBackground />
      <div className="relative z-10 my-auto grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid-cols-5">
        <BrandPanel />
        <div className="flex flex-col lg:col-span-3">
          <BrandBanner />
          <div className="p-6 text-left sm:p-10">{children}</div>
        </div>
      </div>
    </section>
  );
}
