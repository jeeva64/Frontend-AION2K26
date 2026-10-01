import { EventName } from "./constants";

export interface EventRules {
  eventName: EventName;
  category: "technical" | "non-technical";
  rules: string[];
  prerequisites?: string[];
  format?: string;
  specialNotes?: string[];
}

export const EVENT_RULES: Record<EventName, EventRules> = {
  QRush: {
    eventName: "QRush",
    category: "technical",
    format: "Prelims → Mains",
    prerequisites: [
      "Mobile device with proper internet connection",
    ],
    rules: [
      "Only One team per department is allowed.",
      "Team Size: 2 Members.",
      "Topics: Basics concepts of Computer Science (OOPs, SQL, Operating System, Computer Networks and AI).",
      "Prelims will be conducted.",
      "Rules for the Mains round will be announced on the day of the event.",
    ],
  },
  Fixathon: {
    eventName: "Fixathon",
    category: "technical",
    format: "Prelims (Written) → Mains (System-based)",
    prerequisites: [],
    rules: [
      "Only One team per department is allowed.",
      "Team Size: 2 Members.",
      "Prelims: Written test on paper (SQL).",
      "Mains: System-based debugging using Python, Java, C++.",
    ],
  },
  VisionX: {
    eventName: "VisionX",
    category: "technical",
    format: "Prelims (Image) → Mains (Video)",
    prerequisites: [],
    rules: [
      "Only One participant per department is allowed.",
      "Individual participant.",
      "Prelims: Image Creation using any AI tools.",
      "Mains: Video Creation using any AI tools.",
      "Theme will be provided on the spot.",
    ],
  },
  ThinkSync: {
    eventName: "ThinkSync",
    category: "technical",
    format: "Prelims → Mains (Buzzer Round)",
    prerequisites: [
      "Mobile device with proper internet connection",
    ],
    rules: [
      "Only One team per department is allowed.",
      "Team Size: 2 Members.",
      "Questions will be based on technology-related words.",
      "Prelims will be conducted.",
      "Mains: Buzzer round.",
    ],
  },
  "Bid Mayhem": {
    eventName: "Bid Mayhem",
    category: "non-technical",
    format: "Prelims (MCQ) → Mains (Auction) — Spans both slots",
    prerequisites: [],
    rules: [
      "Only One team per department is allowed.",
      "Team Size: 2 Members.",
      "Prelims: MCQ round (Knowledge of IPL from 2008 – 2026 is required).",
      "Mains: Auction round will be conducted.",
      "Rules for the Mains round will be announced on the day of the event.",
    ],
    specialNotes: [
      "Participants of this event cannot participate in any other events.",
      "Prelims in Slot 1 (11:00 AM - 1:00 PM), Mains in Slot 2 (2:00 PM - 4:00 PM).",
    ],
  },
  "Crazy Sell": {
    eventName: "Crazy Sell",
    category: "non-technical",
    format: "Prelims (if needed) → Mains (5 min presentation)",
    prerequisites: [],
    rules: [
      "Only One team per department is allowed.",
      "Team Size: 4 Members.",
      "Duration: 5 Minutes.",
      "Prelims round will be conducted depending on the number of teams that register.",
      "Theme will be provided 15 minutes prior of the event.",
    ],
  },
  "Mute Masters": {
    eventName: "Mute Masters",
    category: "non-technical",
    format: "Three Rounds: Movies → Famous Personalities → Songs",
    prerequisites: [],
    rules: [
      "Only One team per department is allowed.",
      "Team Size: 2 Members.",
      "The event will consist of three rounds: Movies, Famous Personalities, and Songs.",
    ],
  },
  "Treasure Titans": {
    eventName: "Treasure Titans",
    category: "non-technical",
    format: "Clue-based Hunt",
    prerequisites: [],
    rules: [
      "Only One team per department is allowed.",
      "Team Size: 2 Members.",
      "Mobile phones are not allowed, unless explicitly permitted by coordinators.",
      "The team that finds the final treasure first will be declared the winner.",
      "Cheating, misbehaviour, copying or sharing clues, disobeying volunteers, or violating any rules will lead to immediate disqualification.",
      "Organizers have full authority to take final decision.",
    ],
  },
};

export const GENERAL_INSTRUCTIONS = [
  "A maximum of 15 participants per department are allowed to participate.",
  "Each participant may register for a maximum of two events.",
  "Registration fee: ₹200 per participant. The team leader must make one bulk UPI payment for all participants participating. Online Payment only.",
  "Registration is online only. Spot registration is not allowed.",
  "Note: Only one team member should register for the entire team.",
  "Participants must bring a valid college ID card for registration verification. Participants without a valid college ID won't be permitted to participate in the events, even if they have registered.",
  "Participants are requested to report at the registration venue by 8:30 a.m. sharp.",
  "Refreshments and lunch will be provided only to registered participants.",
  "The judges' decision shall be final. No further clarifications or objections will be entertained.",
  "Any team violating the rules or misbehaving inside the campus will be disqualified from further proceedings.",
  "Registration deadline: 05-10-2026 (Monday). For any queries, participants are requested to contact the Chairman of the Symposium. The Chairman's contact details are available in the Symposium Brochure.",
];