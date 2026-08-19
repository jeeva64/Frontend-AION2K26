import { api } from "@/lib/api-client";
import type { College } from "@/lib/types";

export async function getColleges(): Promise<College[]> {
  const body = await api<College[]>("/getcollege", { method: "GET" });
  return Array.isArray(body.data) ? body.data : [];
}

/**
 * Body must be a bare JSON array — do NOT wrap it in an object.
 * Duplicate collegeIds are skipped by the server; `count` = inserted.
 */
export async function addColleges(
  colleges: College[],
  token: string
): Promise<{ count?: number; message?: string }> {
  const body = await api<unknown>("/addcollege", {
    method: "POST",
    token,
    body: colleges,
  });
  const raw = body as unknown as { count?: number };
  return { count: raw.count, message: body.message };
}

export async function updateCollege(
  collegeId: string,
  data: { name?: string; state?: string; district?: string },
  token: string
): Promise<{ message?: string }> {
  const body = await api<unknown>(`/admin/college/${encodeURIComponent(collegeId)}`, {
    method: "PUT",
    token,
    body: data,
  });
  return { message: body.message };
}
