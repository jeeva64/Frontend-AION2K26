import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "About",
  description:
    "About the Department of Artificial Intelligence, St. Joseph's College (Autonomous), Tiruchirappalli, and the team behind AION 2K26.",
};

const GRADIENT_TEXT =
  "bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] bg-clip-text text-transparent";

const GLASS_CARD =
  "rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-[10px] transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]";

const CARD_BASE =
  "rounded-2xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-2.5 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]";

const STAT_BASE =
  "rounded-2xl border border-white/10 bg-white/[0.05] p-8 text-center backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-2.5 hover:bg-white/[0.08] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4", className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function WhyCard() {
  const points = [
    { icon: "bg-blue-500", text: "Industry-oriented curriculum designed for real-world applications" },
    { icon: "bg-purple-500", text: "Research-focused learning environment" },
    { icon: "bg-green-500", text: "Competitive symposium and innovation culture" },
  ];
  return (
    <div className={cn(GLASS_CARD, "animate-fade-in-up p-8 [animation-delay:0.2s]")}>
      <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <span className="text-2xl">🎯</span> Why AI @ SJC?
      </h3>
      <div className="space-y-4">
        {points.map((point) => (
          <div key={point.text} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white",
                point.icon
              )}
            >
              <CheckIcon />
            </span>
            <p className="text-slate-300">{point.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhoWeAre() {
  const stats = [
    { value: "2024", color: "text-blue-400", label: "Established" },
    { value: "2+", color: "text-purple-400", label: "Degree Programs" },
    { value: "10+", color: "text-green-400", label: "Events Conducted" },
    { value: "100+", color: "text-yellow-400", label: "Active Students" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <h2 className="mb-6 text-4xl font-bold">
            Who <span className="text-blue-500">We Are</span>
          </h2>
          <div className="space-y-4 text-lg text-slate-300">
            <p>
              The Department of Artificial Intelligence was established in{" "}
              <span className="font-semibold text-blue-400">2024</span>, offering
              B.Sc. (AI &amp; ML) and M.Sc. (Artificial Intelligence) programs.
            </p>
            <p>
              Our focus lies in academic excellence, applied research, and
              industry-oriented learning through workshops, symposiums, and
              inter-college competitions.
            </p>
            <p>
              We nurture students to become ethical AI professionals equipped with
              cutting-edge technical skills and problem-solving abilities.
            </p>
          </div>
        </div>
        <div className="order-1 grid grid-cols-2 gap-6 md:order-2">
          {stats.map((stat) => (
            <div key={stat.label} className={STAT_BASE}>
              <div className={cn("mb-2 text-5xl font-bold", stat.color)}>
                {stat.value}
              </div>
              <p className="text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisionMission() {
  const cards = [
    {
      icon: "🎯",
      iconBg: "bg-blue-500",
      title: "Vision",
      body: "To produce industry-ready AI professionals with strong ethics, innovation mindset, and technical excellence.",
      list: null,
    },
    {
      icon: "🚀",
      iconBg: "bg-green-500",
      title: "Mission",
      body: "Hands-on learning, research excellence, industry collaboration, and holistic development of future AI leaders.",
      list: null,
    },
    {
      icon: "🏆",
      iconBg: "bg-yellow-500",
      title: "Highlights",
      body: null,
      list: [
        "Industry-oriented curriculum",
        "Professional skill development",
        "Active student association",
      ],
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-8 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.title} className={cn(CARD_BASE, "overflow-hidden")}>
            <div
              className={cn(
                "mb-6 flex h-16 w-16 items-center justify-center rounded-2xl",
                card.iconBg
              )}
            >
              <span className="text-3xl">{card.icon}</span>
            </div>
            <h3 className="mb-4 text-2xl font-bold">{card.title}</h3>
            {card.body ? (
              <p className="text-slate-300">{card.body}</p>
            ) : (
              <ul className="space-y-2 text-slate-300">
                {card.list!.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-blue-400">▸</span> {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

const FACULTY = [
  {
    image: "/hod.jpg",
    alt: "Mr. A Charles",
    overlay: "bg-blue-500",
    badge: "Head of Department",
    name: "Mr. A. Charles",
    role: "Head of the Department",
    roleColor: "text-blue-400",
    creds: "M.Sc., PGDCA, M.Phil.,",
  },
  {
    image: "/mani-sir.jpg",
    alt: "Dr. K. Mani",
    overlay: "bg-purple-500",
    badge: "Assistant Professor",
    name: "Dr. K. Mani",
    role: "Assistant Professor",
    roleColor: "text-purple-400",
    creds: "MCA., CSM., Grad.OR., PGDOR., M.Phil., M.Tech., Ph.D.,",
  },
  {
    image: "/mohan-sir.jpg",
    alt: "Mr. C. Mohanraja",
    overlay: "bg-purple-500",
    badge: "Assistant Professor",
    name: "Mr. C. Mohanraja",
    role: "Assistant Professor",
    roleColor: "text-purple-400",
    creds: "M.Sc., M.Sc(M)., M.Tech., MBA., M.Phil.,",
  },
  {
    image: "/mam.jpg",
    alt: "Dr. J. Hirudhaya Mary Asha",
    overlay: "bg-purple-500",
    badge: "Assistant Professor",
    name: "Dr. J. Hirudhaya Mary Asha",
    role: "Assistant Professor",
    roleColor: "text-purple-400",
    creds: "M.Sc., M.Phil., MCA, M.Tech., Ph.D.,",
  },
  {
    image: "/jesu-sir.jpg",
    alt: "Mr. M. Jesu Doss",
    overlay: "bg-purple-500",
    badge: "Assistant Professor",
    name: "Mr. M. Jesu Doss",
    role: "Assistant Professor",
    roleColor: "text-purple-400",
    creds: "MCA., M.Phil., SET.,",
  },
];

function FacultySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-16 text-center">
        <span className="mb-4 inline-block rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-400">
          Our Team
        </span>
        <h2 className="mb-4 text-5xl font-bold">
          Meet Our <span className="text-blue-500">Faculty</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-slate-400">
          Experienced mentors guiding the next generation of AI innovators
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {FACULTY.map((member) => (
          <div
            key={member.name}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-2.5 hover:border-blue-500/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
          >
            <div className="relative h-[280px] w-full overflow-hidden bg-[linear-gradient(135deg,rgba(59,130,246,0.2),rgba(139,92,246,0.2))]">
              <Image
                src={member.image}
                alt={member.alt}
                fill
                sizes="(max-width: 640px) 100vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs text-white",
                    member.overlay
                  )}
                >
                  {member.badge}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h4 className="mb-1 text-xl font-bold">{member.name}</h4>
              <p className={cn("mb-2 text-sm", member.roleColor)}>
                {member.role}
              </p>
              <p className="text-xs text-slate-400">{member.creds}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const COMMITTEE = [
  { role: "Chairman", name: "Nandakumaaran N I", degree: "I M.Sc AI", phone: "+91 90801 86740" },
  { role: "Secretary", name: "Shri Harish V M", degree: "I M.Sc AI", phone: null },
  { role: "Secretary", name: "Vijayalaxmi K", degree: "II B.Sc AI & ML", phone: null },
  { role: "Secretary", name: "Jeeva Loganathan", degree: "I M.Sc AI", phone: null },
  { role: "Secretary", name: "William James A", degree: "I M.Sc AI", phone: null },
];

function CommitteeSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-5xl font-bold">
          Organizing <span className="text-purple-500">Committee</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-slate-400">
          Student leaders driving the vision and execution of AION 2K26
        </p>
      </div>

      <div className="grid place-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
        {COMMITTEE.map((member) => (
          <div key={member.name} className={cn(GLASS_CARD, "w-full max-w-[320px] p-6 text-center")}>
            <h4 className="mb-2 text-xl font-bold text-blue-400">{member.role}</h4>
            <p className="mb-1 text-lg font-semibold">{member.name}</p>
            <p className="mb-2 text-sm text-slate-400">{member.degree}</p>
            {member.phone && (
              <a href="tel:+919080186740" className="text-sm text-slate-300 hover:text-blue-400">
                📞 {member.phone}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function DevSection() {
  const devs = [
    {
      name: "Jeeva Loganathan",
      link: "https://www.linkedin.com/in/jeeva-l/",
      degree: "I M.Sc Artificial Intelligence",
      phone: "+91 99765 78892",
      phoneHref: "tel:+919976578892",
    },
    {
      name: "William James A",
      link: "https://www.linkedin.com/in/william-james-a-10b126300/",
      degree: "I M.Sc Artificial Intelligence",
      phone: "+91 80565 60315",
      phoneHref: "tel:+918056560315",
    },
  ];
  return (
    <section id="developer-system-admin" className="aion-dev-section">
      <div className="aion-bg-grid" aria-hidden="true" />
      <div className="aion-bg-gradient" aria-hidden="true" />
      <div className="aion-dev-container">
        <h2 className="aion-section-title">Developer &amp; System Admin</h2>
        <p className="aion-section-subtitle">Technical Team • AION 2K26</p>
        <div className="aion-cards-grid">
          {devs.map((dev) => (
            <div key={dev.name} className="aion-team-card">
              <div className="aion-card-glow" aria-hidden="true" />
              <div className="aion-corner-accent aion-corner-tl" aria-hidden="true" />
              <div className="aion-corner-accent aion-corner-br" aria-hidden="true" />
              <div className="aion-card-header">
                <h3 className="aion-name">
                  <Link href={dev.link} target="_blank" rel="noopener noreferrer">
                    {dev.name}
                  </Link>
                </h3>
                <p className="aion-degree">{dev.degree}</p>
              </div>
              <div className="aion-divider" aria-hidden="true" />
              <div className="aion-contact-info">
                <div className="aion-contact-item">
                  <div className="aion-contact-icon" aria-hidden="true">📱</div>
                  <div className="aion-contact-details">
                    <div className="aion-contact-label">Phone</div>
                    <div className="aion-contact-value">
                      <a href={dev.phoneHref}>{dev.phone}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className={`${orbitron.variable} ${rajdhani.variable}`}>
      <main className="bg-slate-950 text-white">
        <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-1/4 h-96 w-96 animate-float rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute right-1/4 bottom-20 h-96 w-96 animate-float-delay rounded-full bg-purple-600/20 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="animate-fade-in-up">
                <span className="mb-4 inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
                  About Us
                </span>
                <h1 className="mb-6 text-5xl font-extrabold leading-tight md:text-6xl">
                  Building the <br />
                  <span className={GRADIENT_TEXT}>Future of AI</span>
                </h1>
                <p className="max-w-xl text-lg text-slate-300">
                  Empowering minds through innovation, ethics, and
                  industry-driven Artificial Intelligence education.
                </p>
              </div>
              <WhyCard />
            </div>
          </div>
        </section>

        <WhoWeAre />
        <VisionMission />
        <FacultySection />
        <CommitteeSection />
      </main>
      <DevSection />
    </div>
  );
}
