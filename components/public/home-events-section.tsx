"use client";

import { useState } from "react";
import { Reveal } from "@/components/public/reveal";
import { EventRulesDialog } from "@/components/public/event-rules-dialog";
import { type EventName } from "@/lib/constants";
import { GENERAL_INSTRUCTIONS } from "@/lib/event-rules";
import { EventCard } from "./home-event-card";

const TECH_EVENTS = [
  {
    name: "QRush" as EventName,
    number: "01",
    description:
      "Test your knowledge in OOPs, SQL, Operating System, Computer Networks and AI",
    badgeClass: "from-cyan-500 to-cyan-700",
  },
  {
    name: "Fixathon" as EventName,
    number: "02",
    description: "Identify and fix bugs in given programs",
    badgeClass: "from-blue-500 to-blue-700",
  },
  {
    name: "VisionX" as EventName,
    number: "03",
    description:
      "Showcase creativity by generating AI-based images and videos on an on the spot theme.",
    badgeClass: "from-purple-500 to-purple-700",
  },
  {
    name: "ThinkSync" as EventName,
    number: "04",
    description: "Connect concepts through logical reasoning",
    badgeClass: "from-indigo-500 to-indigo-700",
  },
];

const NON_TECH_EVENTS = [
  {
    name: "Bid Mayhem" as EventName,
    number: "05",
    description: "Build your dream cricket team in a mock auction",
    badgeClass: "from-emerald-500 to-emerald-700",
  },
  {
    name: "Crazy Sell" as EventName,
    number: "06",
    description: "Showcase creativity through innovative ads",
    badgeClass: "from-amber-500 to-amber-700",
  },
  {
    name: "Mute Masters" as EventName,
    number: "07",
    description: "A classic fun game of acting and guessing",
    badgeClass: "from-red-500 to-red-700",
  },
  {
    name: "Treasure Titans" as EventName,
    number: "08",
    description: "Solve clues and race to find the hidden treasure",
    badgeClass: "from-orange-500 to-orange-700",
  },
];

export function HomeEventsSection() {
  const [openEvent, setOpenEvent] = useState<EventName | null>(null);

  return (
    <>
      <GeneralInstructionsSection />
      <EventsSection onViewRules={setOpenEvent} />
      <EventRulesDialog
        eventName={openEvent}
        open={openEvent !== null}
        onOpenChange={(open) => open || setOpenEvent(null)}
      />
    </>
  );
}

function GeneralInstructionsSection() {
  return (
    <section className="relative bg-[#0f172a] px-[clamp(1rem,3vw,1.5rem)] py-[clamp(2rem,5vw,3.5rem)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <Reveal className="mx-auto max-w-[1280px]">
        <details className="group border-2 border-white/[0.08] bg-white/[0.05] rounded-[clamp(1rem,2vw,1.5rem)] overflow-hidden backdrop-blur-[10px]">
          <summary className="flex items-center justify-between gap-4 p-[clamp(1rem,2.5vw,1.5rem)] cursor-pointer list-none select-none">
            <div className="flex items-center gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 shrink-0 text-blue-400"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <div>
                <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] font-extrabold text-white">
                  General Instructions
                </h2>
                <p className="text-sm text-slate-400">
                  Important guidelines for all participants
                </p>
              </div>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-[details[open]]:rotate-180"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </summary>
          <div className="px-[clamp(1rem,2.5vw,1.5rem)] pb-[clamp(1rem,2.5vw,1.5rem)] animate-slide-down" style={{ animationDuration: "200ms" }}>
            <ol className="space-y-3 text-sm text-slate-200/90 leading-relaxed">
              {GENERAL_INSTRUCTIONS.map((instruction, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs font-bold text-blue-400 bg-blue-500/20 rounded-full">
                    {i + 1}
                  </span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </details>
      </Reveal>
    </section>
  );
}

function EventsSection({
  onViewRules,
}: {
  onViewRules: (eventName: EventName) => void;
}) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_bottom,#1e293b_0%,#0f172a_100%)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="animate-float absolute -left-[10%] top-[12%] h-72 w-72 rounded-full bg-blue-600 opacity-10 blur-[80px]" />
        <div className="animate-float-delay absolute -right-[10%] bottom-[8%] h-80 w-80 rounded-full bg-purple-600 opacity-10 blur-[80px]" />
      </div>

      <div className="relative z-[1] mx-auto max-w-[1280px] px-[clamp(1rem,3vw,1.5rem)] py-[clamp(3rem,8vw,6rem)]">
        <Reveal>
          <div className="mb-[clamp(2.5rem,6vw,4rem)] text-center">
            <span className="mb-[clamp(0.75rem,2vw,1rem)] inline-block rounded-full bg-[linear-gradient(135deg,#DBEAFE_0%,#BFDBFE_100%)] px-[clamp(0.875rem,2vw,1.25rem)] py-[clamp(0.375rem,1vw,0.5rem)] text-[clamp(0.75rem,1.5vw,0.875rem)] font-semibold tracking-wider text-blue-900 uppercase shadow-[0_2px_8px_rgba(37,99,235,0.15)]">
              Technical Events
            </span>
            <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-tight tracking-tight text-white">
              Challenge Your Skills
            </h2>
            <p className="mx-auto mt-[clamp(0.75rem,2vw,1rem)] max-w-[42rem] text-[clamp(0.938rem,2vw,1.125rem)] leading-relaxed text-slate-400">
              Push your technical boundaries with these cutting-edge
              competitions
            </p>
          </div>
        </Reveal>

        <div className="mb-[clamp(4rem,10vw,8rem)] grid grid-cols-1 gap-[clamp(1.25rem,3vw,1.75rem)] sm:grid-cols-2 lg:grid-cols-4">
          {TECH_EVENTS.map((event, i) => (
            <Reveal key={event.name} delay={(i % 4) * 90} className="h-full">
              <EventCard event={event} onViewRules={onViewRules} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mb-[clamp(4rem,10vw,8rem)] text-center">
            <span className="mb-[clamp(0.75rem,2vw,1rem)] inline-block rounded-full bg-[linear-gradient(135deg,#FCE7F3_0%,#FBCFE8_100%)] px-[clamp(0.875rem,2vw,1.25rem)] py-[clamp(0.375rem,1vw,0.5rem)] text-[clamp(0.75rem,1.5vw,0.875rem)] font-semibold tracking-wider text-pink-800 uppercase shadow-[0_2px_8px_rgba(236,72,153,0.15)]">
              Non Technical Events
            </span>
            <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-tight tracking-tight text-white">
              Fun & Creativity
            </h2>
            <p className="mx-auto mt-[clamp(0.75rem,2vw,1rem)] max-w-[42rem] text-[clamp(0.938rem,2vw,1.125rem)] leading-relaxed text-slate-400">
              Unleash your creativity and team spirit with these exciting events
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-[clamp(1.25rem,3vw,1.75rem)] sm:grid-cols-2 lg:grid-cols-4">
          {NON_TECH_EVENTS.map((event, i) => (
            <Reveal key={event.name} delay={(i % 4) * 90} className="h-full">
              <EventCard event={event} onViewRules={onViewRules} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}