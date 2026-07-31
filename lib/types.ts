import type {
  Degree,
  Department,
  EventName,
  EventSlot,
  FoodPreference,
  Shift,
} from "@/lib/constants";

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ message?: string }> | unknown;
}

export interface Leader {
  id?: string;
  userid?: string;
  leaderId?: string;
  name?: string;
  mobile?: string;
  email?: string;
  department?: Department;
  shift?: Shift;
  college?: string;
  collegeId?: string;
  year?: string;
  createdAt?: string;
}

export interface LeaderRegistrationInput {
  name: string;
  mobile: string;
  email: string;
  department: Department;
  shift: Shift;
  college: string;
  password: string;
}

export interface LeaderLoginInput {
  userid: string;
  password: string;
}

export interface Student {
  name: string;
  registerNumber: string;
  mobile: string;
  degree: Degree;
  foodPreference?: FoodPreference;
}

export interface ParticipantInput extends Student {
  event1?: EventName;
  slot1?: EventSlot;
  event2?: EventName | null;
  slot2?: EventSlot | null;
}

export interface TeamRegistrationInput {
  leaderId: string;
  event: EventName;
  participants: Student[];
}

export interface RegisteredStudent extends Student {
  _id?: string;
  leaderId?: string;
  event1: EventName;
  slot1: EventSlot;
  event2?: EventName | null;
  slot2?: EventSlot | null;
  createdAt?: string;
}

/**
 * getcandidates envelope: `data`, `totalStudents` and `registeredEvents`
 * live at the top level of the `{ success, message, ... }` envelope.
 */
export interface CandidatesResponse {
  data?: RegisteredStudent[];
  totalStudents?: number;
  registeredEvents?: EventName[];
  studentCount?: number;
  success?: boolean;
  message?: string;
}

export interface LeaderStats {
  studentsRemaining: number;
  totalStudents?: number;
  success?: boolean;
  message?: string;
}

export interface College {
  collegeId: string;
  name: string;
  state?: string;
  district?: string;
}

export interface AdminLoginInput {
  adminId?: string;
  username?: string;
  email?: string;
  userid?: string;
  password: string;
}

export interface AdminRegisterInput {
  adminId: string;
  name: string;
  role: 1 | 2;
  password: string;
}

export interface Admin {
  id: string;
  name?: string;
  email?: string;
  role: string;
  token?: string;
}

export interface ViewTeamFilter {
  college?: string;
  department?: Department | "";
}

export interface DashboardStats {
  stats?: Record<string, number>;
  [key: string]: unknown;
}
