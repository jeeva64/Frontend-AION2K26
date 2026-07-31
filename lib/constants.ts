export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000";

export const DEPARTMENTS = ["cs", "it", "ai", "ds", "ca"] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const SHIFTS = ["1", "2"] as const;
export type Shift = (typeof SHIFTS)[number];

export const DEGREES = ["ug", "pg"] as const;
export type Degree = (typeof DEGREES)[number];

export const FOOD_PREFERENCES = ["vegetarian", "non-vegetarian"] as const;
export type FoodPreference = (typeof FOOD_PREFERENCES)[number];

export const MAX_STUDENTS_PER_LEADER = 15;
export const MAX_EVENTS_PER_STUDENT = 2;
export const EVENT_NAMES = [
  "Fixathon",
  "Bid Mayhem",
  "Mute Masters",
  "Treasure Titans",
  "QRush",
  "VisionX",
  "ThinkSync",
  "Crazy Sell",
] as const;
export type EventName = (typeof EVENT_NAMES)[number];

export const SLOT_1_EVENTS: EventName[] = [
  "Fixathon",
  "Bid Mayhem",
  "Mute Masters",
  "Treasure Titans",
];
export const SLOT_2_EVENTS: EventName[] = [
  "QRush",
  "VisionX",
  "ThinkSync",
  "Crazy Sell",
];

export type EventSlot = "1" | "2" | "BOTH";

export interface EventConfig {
  slot: EventSlot;
  participants: number;
  time: string;
}

export const EVENT_CONFIG: Record<EventName, EventConfig> = {
  Fixathon: { slot: "1", participants: 2, time: "11:00 AM - 1:00 PM" },
  "Bid Mayhem": {
    slot: "BOTH",
    participants: 2,
    time: "11:00 AM - 4:00 PM (Prelims & Mains)",
  },
  "Mute Masters": { slot: "1", participants: 2, time: "11:00 AM - 1:00 PM" },
  "Treasure Titans": { slot: "1", participants: 2, time: "11:00 AM - 1:00 PM" },
  QRush: { slot: "2", participants: 2, time: "2:00 PM - 4:00 PM" },
  VisionX: { slot: "2", participants: 1, time: "2:00 PM - 4:00 PM" },
  ThinkSync: { slot: "2", participants: 2, time: "2:00 PM - 4:00 PM" },
  "Crazy Sell": { slot: "2", participants: 4, time: "2:00 PM - 4:00 PM" },
};

export const ADMIN_ROLES = ["super_admin", "moderator"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const DEPT_LABELS: Record<Department, string> = {
  cs: "Computer Science",
  it: "Information Technology",
  ai: "Artificial Intelligence",
  ds: "Data Science",
  ca: "Computer Applications",
};
