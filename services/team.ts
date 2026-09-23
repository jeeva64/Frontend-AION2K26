import { api } from "@/lib/api-client";
import type { RegisterTeamPaymentInfo } from "@/services/payment";
import type {
  CandidatesResponse,
  LeaderStats,
  RegisteredStudent,
  TeamRegistrationInput,
} from "@/lib/types";

export interface RegisterTeamResult extends RegisterTeamPaymentInfo {
  created?: number;
  updated?: number;
  message?: string;
}

export async function registerTeam(
  input: TeamRegistrationInput,
  token: string
): Promise<RegisterTeamResult> {
  const body = await api<unknown>("/registerteam", {
    method: "POST",
    token,
    body: input,
  });
  const raw = body as unknown as RegisterTeamResult;
  return {
    created: raw.created,
    updated: raw.updated,
    message: body.message,
    uniqueStudents: raw.uniqueStudents,
    amountDuePaises: raw.amountDuePaises,
    currency: raw.currency,
    upiUri: raw.upiUri ?? null,
    paymentStatus: raw.paymentStatus,
  };
}

export async function getCandidates(
  userId: string,
  token: string
): Promise<CandidatesResponse> {
  const body = await api<RegisteredStudent[]>("/getcandidates", {
    method: "POST",
    token,
    body: { user_id: userId },
  });
  return body as unknown as CandidatesResponse;
}

export async function getLeaderStats(
  leaderId: string,
  token: string
): Promise<LeaderStats> {
  const body = await api<unknown>(`/stats/${leaderId}`, {
    method: "GET",
    token,
  });
  const raw = body as unknown as LeaderStats;
  return {
    studentsRemaining:
      raw.stats?.studentsRemaining ?? raw.studentsRemaining ?? 0,
    totalStudents: raw.stats?.totalStudents ?? raw.totalStudents,
    registrationDeadline: raw.registrationDeadline ?? null,
  };
}
