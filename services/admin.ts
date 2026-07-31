import { api } from "@/lib/api-client";
import type {
  AdminLoginInput,
  AdminRegisterInput,
  DashboardStats,
  RegisteredStudent,
  ViewTeamFilter,
} from "@/lib/types";

export interface AdminLoginResponse {
  role?: string | number;
  token?: string;
  message?: string;
}

/**
 * `POST /admin/adminlogin` returns `role` and `token` at the envelope
 * level (NOT inside `data`).
 */
export async function adminLogin(
  input: AdminLoginInput
): Promise<AdminLoginResponse> {
  const body = await api<unknown>("/admin/adminlogin", {
    method: "POST",
    body: input,
  });
  const raw = body as unknown as {
    role?: string | number;
    token?: string;
    message?: string;
  };
  return { role: raw.role, token: raw.token, message: raw.message };
}

/** Requires a Super Admin Bearer token. */
export async function adminRegister(
  input: AdminRegisterInput,
  token: string
): Promise<{ message?: string }> {
  const body = await api<unknown>("/admin/adminreg", {
    method: "POST",
    token,
    body: input,
  });
  return { message: body.message };
}

/** Empty result returns 200 with empty `data` — treat as "no team". */
export async function viewTeam(
  filter: ViewTeamFilter,
  token: string
): Promise<RegisteredStudent[]> {
  const body = await api<RegisteredStudent[]>("/admin/viewteam", {
    method: "POST",
    token,
    body: filter,
  });
  return Array.isArray(body.data) ? body.data : [];
}

export interface EventRegEntry {
  leaderId?: string;
  college?: string;
  department?: string;
  members?: RegisteredStudent[];
}

/** No registrations → 404; show empty state. */
export async function viewEventRegs(
  eventName: string,
  token: string
): Promise<EventRegEntry[]> {
  const body = await api<EventRegEntry[]>("/admin/vieweventregs", {
    method: "POST",
    token,
    body: { eventName },
  });
  return Array.isArray(body.data) ? body.data : [];
}

export async function deleteTeam(
  leaderId: string,
  token: string
): Promise<{ deletedCount?: number; message?: string }> {
  const body = await api<unknown>(
    `/admin/deleteteam/${encodeURIComponent(leaderId)}`,
    { method: "DELETE", token }
  );
  const raw = body as unknown as { deletedCount?: number };
  return { deletedCount: raw.deletedCount, message: body.message };
}

export async function deleteTeamByEvent(
  leaderId: string,
  event: string,
  token: string
): Promise<{ updatedCount?: number; deletedCount?: number; message?: string }> {
  const body = await api<unknown>(
    `/admin/deleteteambyevent/${encodeURIComponent(leaderId)}/${encodeURIComponent(event)}`,
    { method: "DELETE", token }
  );
  const raw = body as unknown as { updatedCount?: number; deletedCount?: number };
  return {
    updatedCount: raw.updatedCount,
    deletedCount: raw.deletedCount,
    message: body.message,
  };
}

export async function getDashboardStats(
  token: string
): Promise<DashboardStats> {
  const body = await api<unknown>("/admin/dashboardstats", {
    method: "GET",
    token,
  });
  const raw = body as unknown as { stats?: Record<string, number> };
  return { stats: raw.stats };
}
