import { api } from "@/lib/api-client";
import type {
  CandidatesResponse,
  LeaderStats,
  RegisteredStudent,
  TeamRegistrationInput,
} from "@/lib/types";

export interface RegisterTeamResult {
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
  const raw = body as unknown as { created?: number; updated?: number };
  return { created: raw.created, updated: raw.updated, message: body.message };
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
    studentsRemaining: raw.studentsRemaining ?? 0,
    totalStudents: raw.totalStudents,
  };
}
