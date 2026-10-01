"use client";

import { EventName } from "@/lib/constants";
import { EVENT_CONFIG } from "@/lib/constants";

interface EventInfo {
  name: EventName;
  number: string;
  description: string;
  badgeClass: string;
}

function slotLabelText(slot: "1" | "2" | "BOTH"): string {
  if (slot === "BOTH") return "Both Slots";
  return slot === "1" ? "Slot 1" : "Slot 2";
}

export function EventCard({
  event,
  onViewRules,
}: {
  event: EventInfo;
  onViewRules: (eventName: EventName) => void;
}) {
  const config = EVENT_CONFIG[event.name];
  const slotLabel = `${slotLabelText(config.slot)} • ${config.time}`;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[clamp(1rem,2vw,1.5rem)] border-2 border-white/[0.08] bg-white/[0.05] px-[clamp(1.5rem,3vw,2rem)] py-[clamp(1.75rem,4vw,2.5rem)] text-center shadow-[0_8px_24px_rgba(0,0,0,0.15)] backdrop-blur-[10px] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(59,130,246,0.1)_0%,transparent_60%)] before:opacity-0 before:transition-opacity before:duration-[400ms] hover:-translate-y-3 hover:border-blue-500/50 hover:shadow-[0_20px_48px_rgba(0,0,0,0.25)] hover:before:opacity-100 focus-within:ring-2 focus-within:ring-blue-500/50">
      <div
        className={`absolute -top-3.5 left-1/2 z-10 flex h-[clamp(2.5rem,6vw,3rem)] min-w-[clamp(2.5rem,6vw,3rem)] -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br px-2 font-bold text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)] ${event.badgeClass}`}
      >
        {event.number}
      </div>

      <h3 className="relative z-[1] mt-[clamp(1rem,2vw,1.5rem)] mb-[clamp(0.5rem,1.5vw,0.75rem)] text-[clamp(1.125rem,2.5vw,1.5rem)] font-bold leading-snug text-white">
        {event.name}
      </h3>
      <p className="relative z-[1] mb-[clamp(0.75rem,2vw,1rem)] text-[clamp(0.875rem,1.8vw,1rem)] leading-relaxed text-slate-200/80">
        {event.description}
      </p>

      <div className="relative z-[1] mt-auto flex flex-col gap-[clamp(0.375rem,1vw,0.5rem)] border-t border-white/10 pt-[clamp(0.75rem,2vw,1rem)]">
        <span className="text-[clamp(0.75rem,1.5vw,0.813rem)] font-semibold tracking-wide text-blue-400">
          {slotLabel}
        </span>
        <span className="text-[clamp(0.75rem,1.5vw,0.813rem)] font-semibold tracking-wide text-slate-400">
          {config.participants}{" "}
          {config.participants === 1 ? "Member" : "Members"}
        </span>
        <button
          type="button"
          onClick={() => onViewRules(event.name)}
          className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(59,130,246,0.35)] transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-[0_8px_20px_rgba(59,130,246,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
          aria-label={`View rules for ${event.name}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          View Rules
        </button>
      </div>
    </div>
  );
}