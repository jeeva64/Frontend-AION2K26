"use client";

const LEADER_TOKEN_KEY = "leader_token";
const LEADER_ID_KEY = "leader_id";
const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_ROLE_KEY = "admin_role";

export function getLeaderToken(): string | null {
  return localStorage.getItem(LEADER_TOKEN_KEY);
}

export function getLeaderId(): string | null {
  return localStorage.getItem(LEADER_ID_KEY);
}

export function setLeaderAuth(token: string, leaderId: string): void {
  localStorage.setItem(LEADER_TOKEN_KEY, token);
  localStorage.setItem(LEADER_ID_KEY, leaderId);
}

export function clearLeaderAuth(): void {
  localStorage.removeItem(LEADER_TOKEN_KEY);
  localStorage.removeItem(LEADER_ID_KEY);
}

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getAdminRole(): string | null {
  return localStorage.getItem(ADMIN_ROLE_KEY);
}

export function setAdminAuth(token: string, role: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_ROLE_KEY, role);
}

export function clearAdminAuth(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_ROLE_KEY);
}

export function clearAllAuth(): void {
  clearLeaderAuth();
  clearAdminAuth();
}

export function isLeaderLoggedIn(): boolean {
  return Boolean(getLeaderToken() && getLeaderId());
}

export function isAdminLoggedIn(): boolean {
  return Boolean(getAdminToken());
}

export function redirectToLogin(router: { push: (href: string) => void }) {
  clearAllAuth();
  router.push("/login");
}
