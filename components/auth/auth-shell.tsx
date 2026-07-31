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

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <section className="relative flex min-h-[calc(100vh-3rem)] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#1e293b_0%,#0f172a_100%)] px-4 py-12">
      <AuthHeroBackground />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-8 text-center shadow-xl sm:p-10">
        {children}
      </div>
    </section>
  );
}
