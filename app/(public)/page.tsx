import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/public/reveal";
import {
  EVENT_CONFIG,
  SLOT_1_EVENTS,
  SLOT_2_EVENTS,
  type EventName,
  type EventSlot,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Home",
  description:
    "AION 2K26 2.0 - State Level Technical Symposium. 8 events, 1 day, ₹200 per participant. October 7, 2026 at St. Joseph's College.",
  alternates: {
    canonical: "/",
  },
};

function slotLabelText(slot: EventSlot): string {
  if (slot === "BOTH") return "Both Slots";
  return slot === "1" ? "Slot 1" : "Slot 2";
}

const SLOT_1_TIME =
  EVENT_CONFIG[SLOT_1_EVENTS.find((e) => EVENT_CONFIG[e].slot === "1")!].time;
const SLOT_2_TIME =
  EVENT_CONFIG[SLOT_2_EVENTS.find((e) => EVENT_CONFIG[e].slot === "2")!].time;

/* ────────────────────────────────────────────────────────────────
   HERO
──────────────────────────────────────────────────────────────── */

const ORB_CLASSES = [
  "animate-float",
  "animate-float-delay",
  "animate-float [animation-delay:2s]",
];

const PARTICLES = [
  {
    className: "top-[20%] left-[15%]",
    style: { "--tx": "50px", "--ty": "-80px" },
    delay: "0s",
  },
  {
    className: "top-[40%] right-[20%]",
    style: { "--tx": "-60px", "--ty": "70px" },
    delay: "1s",
  },
  {
    className: "bottom-[30%] left-[25%]",
    style: { "--tx": "40px", "--ty": "-60px" },
    delay: "2s",
  },
  {
    className: "top-[60%] right-[15%]",
    style: { "--tx": "-50px", "--ty": "80px" },
    delay: "3s",
  },
  {
    className: "bottom-[20%] left-[40%]",
    style: { "--tx": "70px", "--ty": "-50px" },
    delay: "1.5s",
  },
  {
    className: "top-[70%] right-[35%]",
    style: { "--tx": "-40px", "--ty": "60px" },
    delay: "2.5s",
  },
];

function HeroBackground() {
  const orbGradients = [
    "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
    "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
    "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
  ];
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {orbGradients.map((bg, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-[60px] ${ORB_CLASSES[i]} ${
            i === 0
              ? "-top-[10%] -left-[10%] h-[clamp(300px,50vw,600px)] w-[clamp(300px,50vw,600px)]"
              : i === 1
                ? "-right-[10%] -bottom-[10%] h-[clamp(250px,40vw,500px)] w-[clamp(250px,40vw,500px)]"
                : "top-[50%] left-[50%] h-[clamp(200px,35vw,450px)] w-[clamp(200px,35vw,450px)] -translate-x-1/2 -translate-y-1/2"
          }`}
          style={{ background: bg, opacity: 0.4 }}
        />
      ))}
      <div className="pointer-events-none absolute inset-0">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className={`absolute h-[clamp(4px,1vw,8px)] w-[clamp(4px,1vw,8px)] animate-particle-float rounded-full ${p.className}`}
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
  );
}

function InfoRow({
  icon,
  children,
  variant,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  variant: "naac" | "standards";
}) {
  const styles =
    variant === "naac"
      ? "border-[rgba(251,191,36,0.28)] bg-[linear-gradient(135deg,rgba(251,191,36,0.15),rgba(245,158,11,0.08))]"
      : "border-[rgba(56,189,248,0.25)] bg-[linear-gradient(135deg,rgba(56,189,248,0.14),rgba(99,202,255,0.07))]";
  const iconColor = variant === "naac" ? "text-amber-400" : "text-sky-400";
  const textColor = variant === "naac" ? "text-amber-200" : "text-sky-300";

  return (
    <div
      className={`mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border px-2.5 py-1.5 backdrop-blur-sm ${styles}`}
    >
      <span className={`h-4 w-4 shrink-0 ${iconColor}`}>{icon}</span>
      <span
        className={`text-[clamp(0.6rem,1.4vw,0.82rem)] font-medium leading-snug ${textColor}`}
      >
        {children}
      </span>
    </div>
  );
}

function CollegeHeader() {
  return (
    <div className="flex w-full animate-fade-in-up flex-row flex-wrap items-center justify-center gap-x-[clamp(0.5rem,2vw,1.15rem)] gap-y-3">
      <Image
        src="/clg-logo.png"
        alt="College Logo"
        width={125}
        height={125}
        priority
        className="h-[clamp(3rem,9vw,7.8rem)] w-[clamp(3rem,9vw,7.8rem)] shrink-0 animate-glow object-contain transition-transform hover:rotate-6 hover:scale-110"
      />
      <div className="min-w-0 w-full text-center sm:w-auto sm:flex-1">
        <p className="mb-0.5 text-[clamp(0.85rem,1.6vw,1rem)] font-semibold tracking-widest text-blue-400 uppercase">
          Department of Artificial Intelligence
        </p>
        <h1 className="text-[clamp(1.2rem,2.8vw,1.75rem)] font-extrabold leading-tight text-white">
          St. Joseph&apos;s College (Autonomous)
        </h1>
        <p className="text-[clamp(0.656rem,1.2vw,0.75rem)] font-medium text-slate-400">
          Affiliated to Bharathidasan University, Tiruchirappalli
        </p>
        <div className="mt-2 space-y-1.5">
          <InfoRow
            variant="naac"
            icon={
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-full w-full"
              >
                <path d="M10 2l2.4 5.6L18 8.5l-4 3.8.9 5.7L10 15l-4.9 3 .9-5.7-4-3.8 5.6-.9z" />
              </svg>
            }
          >
            Accredited at <strong>A++ (Cycle IV)</strong> by NAAC
            <span className="mx-1 opacity-50">•</span> Special Heritage Status
            by UGC
          </InfoRow>
          <InfoRow
            variant="standards"
            icon={
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-full w-full"
              >
                <rect x="2" y="11" width="3" height="7" rx="0.8" />
                <rect x="8.5" y="7" width="3" height="11" rx="0.8" />
                <rect x="15" y="3" width="3" height="15" rx="0.8" />
              </svg>
            }
          >
            College with Potential for Excellence (UGC)
            <span className="mx-1 opacity-50">•</span>{" "}
            <strong>25th Rank in NIRF 2025</strong>
          </InfoRow>
        </div>
      </div>
      <Image
        src="/asso-logo.png"
        alt="Department Logo"
        width={125}
        height={125}
        priority
        className="h-[clamp(3rem,9vw,7.8rem)] w-[clamp(3rem,9vw,7.8rem)] shrink-0 animate-glow object-contain transition-transform hover:rotate-6 hover:scale-110"
      />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#1e293b_0%,#0f172a_100%)] px-[clamp(1rem,3vw,1.5rem)] pt-[calc(3.5rem+1.25rem)] pb-[clamp(1.5rem,4vh,3rem)]">
      <HeroBackground />
      <div className="relative z-10 w-full max-w-[1280px] mx-auto">
        <div className="flex w-full flex-col items-center gap-[clamp(0.5rem,1.2vh,1rem)]">
          <CollegeHeader />

          <div className="inline-flex animate-fade-in-up items-center gap-2 rounded-full border-2 border-blue-500/20 bg-white/[0.08] px-[clamp(0.875rem,2.2vw,1.15rem)] py-[clamp(0.375rem,1vh,0.5rem)] text-[clamp(0.719rem,1.25vw,0.813rem)] font-semibold text-blue-300 shadow-[0_4px_16px_rgba(59,130,246,0.2)] backdrop-blur-[10px] [animation-delay:0.2s]">
            <span className="relative flex h-4 w-4 items-center justify-center">
              <span className="absolute h-full w-full animate-pulse-ring rounded-full bg-blue-400" />
              <span className="relative h-2 w-2 rounded-full bg-blue-400" />
            </span>
            Proudly Presents
          </div>

          <div className="animate-fade-in-up [animation-delay:0.35s]">
            <Image
              src="/logo-v2.png"
              alt="AION 2K26 2.0"
              width={1665}
              height={945}
              priority
              className="max-h-[min(28vh,240px)] max-w-[min(80vw,520px)] w-auto"
              style={{ width: "auto", height: "auto" }}
            />
          </div>

          <div className="flex animate-fade-in-up flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full bg-white/[0.08] px-[clamp(0.875rem,2vw,1.15rem)] py-[clamp(0.375rem,1vh,0.5rem)] text-center text-[clamp(0.656rem,1.3vw,0.8rem)] font-medium text-slate-300 backdrop-blur-sm [animation-delay:0.45s]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0 text-blue-400"
            >
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>October 7, 2026</span>
            <span className="opacity-50">|</span>
            <span>Wednesday @ </span>
            <a
              href="https://maps.app.goo.gl/tfLssgZkGV4i1Wtz7"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-blue-400/40 underline-offset-2 transition-colors hover:text-blue-300 hover:decoration-blue-300"
            >
              Sail Hall, Arrupe Library
            </a>
          </div>

          <div className="grid animate-fade-in-up grid-cols-3 gap-2 [animation-delay:0.55s] sm:gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-center backdrop-blur-[10px] sm:px-6 sm:py-4">
              <div className="text-xl font-extrabold text-blue-400 sm:text-3xl">
                8
              </div>
              <div className="mt-1 text-xs text-slate-300 sm:text-sm">
                Events
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-center backdrop-blur-[10px] sm:px-6 sm:py-4">
              <div className="text-xl font-extrabold text-emerald-400 sm:text-3xl">
                ₹200
              </div>
              <div className="mt-1 text-xs text-slate-300 sm:text-sm">
                Entry Fee
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-center backdrop-blur-[10px] sm:px-6 sm:py-4">
              <div className="text-xl font-extrabold text-amber-400 sm:text-3xl">
                1 Day
              </div>
              <div className="mt-1 text-[0.65rem] leading-tight text-slate-300 sm:text-sm">
                Power-Packed Experience
              </div>
            </div>
          </div>

          <div className="mt-1 flex animate-fade-in-up flex-col items-center gap-3 sm:flex-row [animation-delay:0.65s]">
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-3 font-semibold text-white shadow-[0_8px_20px_rgba(59,130,246,0.35)] transition-transform hover:-translate-y-0.5"
            >
              Register Now
            </Link>
            <Link
              href="/brochure"
              className="inline-flex items-center justify-center rounded-full border-2 border-blue-500/50 px-8 py-3 font-semibold text-blue-400 transition-all hover:bg-blue-500 hover:text-white"
            >
              View Brochure
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────
   EVENTS
──────────────────────────────────────────────────────────────── */

interface EventInfo {
  name: EventName;
  number: string;
  description: string;
  badgeClass: string;
}

const TECH_EVENTS: EventInfo[] = [
  {
    name: "QRush",
    number: "01",
    description:
      "Test your knowledge in OOPs, SQL, Operating System, Computer Networks and AI",
    badgeClass: "from-cyan-500 to-cyan-700",
  },
  {
    name: "Fixathon",
    number: "02",
    description: "Identify and fix bugs in given programs",
    badgeClass: "from-blue-500 to-blue-700",
  },
  {
    name: "VisionX",
    number: "03",
    description:
      "Showcase creativity by generating AI-based images and videos on an on the spot theme.",
    badgeClass: "from-purple-500 to-purple-700",
  },
  {
    name: "ThinkSync",
    number: "04",
    description: "Connect concepts through logical reasoning",
    badgeClass: "from-indigo-500 to-indigo-700",
  },
];

const NON_TECH_EVENTS: EventInfo[] = [
  {
    name: "Bid Mayhem",
    number: "05",
    description: "Build your dream cricket team in a mock auction",
    badgeClass: "from-emerald-500 to-emerald-700",
  },
  {
    name: "Crazy Sell",
    number: "06",
    description: "Showcase creativity through innovative ads",
    badgeClass: "from-amber-500 to-amber-700",
  },
  {
    name: "Mute Masters",
    number: "07",
    description: "A classic fun game of acting and guessing",
    badgeClass: "from-red-500 to-red-700",
  },
  {
    name: "Treasure Titans",
    number: "08",
    description: "Solve clues and race to find the hidden treasure",
    badgeClass: "from-orange-500 to-orange-700",
  },
];

function EventCard({ event }: { event: EventInfo }) {
  const config = EVENT_CONFIG[event.name];
  const slotLabel = `${slotLabelText(config.slot)} • ${config.time}`;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[clamp(1rem,2vw,1.5rem)] border-2 border-white/[0.08] bg-white/[0.05] px-[clamp(1.5rem,3vw,2rem)] py-[clamp(1.75rem,4vw,2.5rem)] text-center shadow-[0_8px_24px_rgba(0,0,0,0.15)] backdrop-blur-[10px] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(59,130,246,0.1)_0%,transparent_60%)] before:opacity-0 before:transition-opacity before:duration-[400ms] hover:-translate-y-3 hover:border-blue-500/50 hover:shadow-[0_20px_48px_rgba(0,0,0,0.25)] hover:before:opacity-100">
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
      </div>
    </div>
  );
}

function ScheduleSlotCard({
  title,
  time,
  events,
  accentClass,
  dotClass,
}: {
  title: string;
  time: string;
  events: EventName[];
  accentClass: string;
  dotClass: string;
}) {
  return (
    <div className="rounded-[clamp(1rem,2vw,1.25rem)] border-2 border-white/[0.08] bg-white/[0.05] p-[clamp(1rem,2.5vw,1.5rem)] backdrop-blur-[10px]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <span className={`slot-badge ${accentClass}`}>{time}</span>
      </div>
      <ul className="space-y-2 text-sm text-slate-200/85">
        {events.map((event) => (
          <li key={event} className="flex items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
            {event}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScheduleStrip() {
  return (
    <section className="relative bg-[#0f172a] px-[clamp(1rem,3vw,1.5rem)] py-[clamp(2rem,5vw,3.5rem)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <Reveal className="mx-auto max-w-[1280px]">
        <div className="mb-[clamp(1.25rem,3vw,2rem)] text-center">
          <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-extrabold tracking-tight text-white">
            Schedule at a Glance
          </h2>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Two slots, eight events - plan your day
          </p>
        </div>

        <div className="grid grid-cols-1 gap-[clamp(1rem,2.5vw,1.5rem)] md:grid-cols-2">
          <ScheduleSlotCard
            title="Slot 1"
            time={SLOT_1_TIME}
            events={SLOT_1_EVENTS.filter((e) => EVENT_CONFIG[e].slot === "1")}
            accentClass="slot-1"
            dotClass="bg-purple-400"
          />
          <ScheduleSlotCard
            title="Slot 2"
            time={SLOT_2_TIME}
            events={SLOT_2_EVENTS.filter((e) => EVENT_CONFIG[e].slot === "2")}
            accentClass="slot-2"
            dotClass="bg-pink-400"
          />
        </div>

        <div className="mx-auto mt-4 flex w-fit max-w-full items-center gap-2 rounded-full border border-red-500/25 bg-[linear-gradient(135deg,rgba(239,68,68,0.14),rgba(220,38,38,0.07))] px-4 py-1.5 text-xs font-medium text-red-300 backdrop-blur-sm sm:text-sm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 shrink-0 text-red-400"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>
            <strong className="font-semibold text-red-400">Bid Mayhem</strong>{" "}
            spans both slots (11:00 AM - 4:00 PM): Prelims in Slot 1, Mains in
            Slot 2.
          </span>
        </div>
      </Reveal>
    </section>
  );
}

function EventsSection() {
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
              <EventCard event={event} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mb-[clamp(4rem,10vw,8rem)] text-center">
            <span className="mb-[clamp(0.75rem,2vw,1rem)] inline-block rounded-full bg-[linear-gradient(135deg,#FCE7F3_0%,#FBCFE8_100%)] px-[clamp(0.875rem,2vw,1.25rem)] py-[clamp(0.375rem,1vw,0.5rem)] text-[clamp(0.75rem,1.5vw,0.875rem)] font-semibold tracking-wider text-pink-800 uppercase shadow-[0_2px_8px_rgba(236,72,153,0.15)]">
              Non Technical Events
            </span>
            <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-tight tracking-tight text-white">
              Fun &amp; Creativity
            </h2>
            <p className="mx-auto mt-[clamp(0.75rem,2vw,1rem)] max-w-[42rem] text-[clamp(0.938rem,2vw,1.125rem)] leading-relaxed text-slate-400">
              Unleash your creativity and team spirit with these exciting events
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-[clamp(1.25rem,3vw,1.75rem)] sm:grid-cols-2 lg:grid-cols-4">
          {NON_TECH_EVENTS.map((event, i) => (
            <Reveal key={event.name} delay={(i % 4) * 90} className="h-full">
              <EventCard event={event} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────── */

export default function HomePage() {
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "AION 2K26 2.0",
    description:
      "State Level Technical Symposium with 8 events by the Department of Artificial Intelligence, St. Joseph's College (Autonomous), Tiruchirappalli.",
    startDate: "2026-10-07",
    endDate: "2026-10-07",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "St. Joseph's College (Autonomous)",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Tiruchirappalli",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Department of Artificial Intelligence, St. Joseph's College (Autonomous)",
    },
    offers: {
      "@type": "Offer",
      price: "200",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: "/register",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <Hero />
      <ScheduleStrip />
      <EventsSection />
    </>
  );
}
