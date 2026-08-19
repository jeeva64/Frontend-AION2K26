// Event → Slot mapping (single source of truth)
export const EVENT_SLOT_MAP = {
  "Fixathon": "Slot 1",
  "Mute Masters": "Slot 1",
  "Treasure Titans": "Slot 1",
  "Bid Mayhem": "Both",
  "QRush": "Slot 2",
  "VisionX": "Slot 2",
  "ThinkSync": "Slot 2",
  "Crazy Sell": "Slot 2"
} as const;

export type EventName = keyof typeof EVENT_SLOT_MAP;
export type EventSlot = "Slot 1" | "Slot 2" | "Both";

// Department options (value matches backend)
export const DEPARTMENTS = [
  { value: "cs", label: "Computer Science" },
  { value: "ds", label: "Data Science" },
  { value: "ai", label: "AI & ML" },
  { value: "it", label: "Information Technology" },
  { value: "ca", label: "Computer Applications" }
] as const;

export type DepartmentValue = typeof DEPARTMENTS[number]["value"];

// Tamil Nadu districts (40 options from original HTML)
export const TN_DISTRICTS = [
  "Tiruchirappalli", "Perambalur", "Ariyalur", "Karur", "Pudukkottai",
  "Thanjavur", "Tiruvarur", "Nagapattinam", "Mayiladuthurai", "Namakkal",
  "Salem", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
  "Kanniyakumari", "Krishnagiri", "Madurai", "Nilgiris", "Ramanathapuram",
  "Ranipet", "Sivaganga", "Tenkasi", "Theni", "Thoothukudi",
  "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai",
  "Vellore", "Viluppuram", "Virudhunagar"
] as const;

// Event color classes (light + dark mode)
export const EVENT_COLORS: Record<EventName, string> = {
  "Fixathon": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
  "Mute Masters": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300",
  "Treasure Titans": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300",
  "VisionX": "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300",
  "QRush": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300",
  "ThinkSync": "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300",
  "Bid Mayhem": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300",
  "Crazy Sell": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300"
};

// Degree labels
export const DEGREE_LABELS = { ug: "UG", pg: "PG" } as const;

// Food preference icons
export const FOOD_ICONS = {
  vegetarian: "🌱",
  "non-vegetarian": "🍖"
} as const;

// Slot badge colors
export const SLOT_COLORS: Record<EventSlot, string> = {
  "Slot 1": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Slot 2": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Both": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
};