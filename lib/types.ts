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
  status?: RegistrationStatus;
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

export interface LeaderStatsNested {
  totalStudents?: number;
  studentsRemaining?: number;
  eventsRegistered?: number;
  registeredEvents?: EventName[];
}

export interface LeaderStats {
  studentsRemaining: number;
  totalStudents?: number;
  registrationDeadline?: string | null;
  stats?: LeaderStatsNested;
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
  role: 2;
  password: string;
}

export interface AdminChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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

export interface CollegeStat {
  college: string;
  department: string;
  members: number;
  veg: number;
  nonVeg: number;
}

export interface DashboardStats {
  totalMembers: number;
  totalTeams: number;
  vegCount: number;
  nonVegCount: number;
  ugCount: number;
  pgCount: number;
  eventCounts: Record<string, number>;
  collegeStats: CollegeStat[];
  deptCounts: Record<string, number>;
}

export type PaymentStatus =
  | "PENDING"
  | "VERIFICATION_PENDING"
  | "SUCCESS"
  | "REJECTED";

export type RegistrationStatus =
  | "PAYMENT_PENDING"
  | "VERIFICATION_PENDING"
  | "CONFIRMED"
  | "REJECTED";

export interface PaymentInfo {
  paymentId?: number;
  leaderId?: string;
  expectedAmountPaises?: number;
  submittedAmountPaises?: number | null;
  currency?: string;
  utr?: string | null;
  paymentStatus?: PaymentStatus;
  submittedAt?: string | null;
  verifiedAt?: string | null;
  rejectionReason?: string | null;
}

export interface MyPaymentResponse {
  success: boolean;
  message?: string;
  uniqueStudents: number;
  amountDuePaises: number;
  upiUri: string | null;
  registrationDeadline?: string | null;
  data: PaymentInfo | null;
}

export interface PaymentSummaryRow extends PaymentInfo {
  _id: number;
  proofObjectKey?: string | null;
  verifiedBy?: string | null;
  leaderName?: string | null;
  leaderCollege?: string | null;
  leaderDepartment?: string | null;
  verifierName?: string | null;
}

export interface PaymentAuditEntry {
  auditId: number;
  paymentId: number;
  adminId: string | null;
  action: string;
  oldStatus: string | null;
  newStatus: string | null;
  reason: string | null;
  createdAt: string;
}

export interface PaymentDetail extends PaymentSummaryRow {
  proofOriginalFilename?: string | null;
  proofMimeType?: string | null;
  proofFileSize?: number | null;
}

export interface EventSettings {
  success: boolean;
  message?: string;
  registrationDeadline: string | null;
}
