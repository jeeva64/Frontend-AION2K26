"use client";

const LEADER_TOKEN_KEY = "leader_token";
const LEADER_ID_KEY = "leader_id";
const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_ROLE_KEY = "admin_role";

const isBrowser = typeof window !== "undefined";

function getStorage(): Storage | null {
  return isBrowser ? window.localStorage : null;
}

export function getLeaderToken(): string | null {
  const storage = getStorage();
  return storage?.getItem(LEADER_TOKEN_KEY) ?? null;
}

export function getLeaderId(): string | null {
  const storage = getStorage();
  return storage?.getItem(LEADER_ID_KEY) ?? null;
}

export function setLeaderAuth(token: string, leaderId: string): void {
  const storage = getStorage();
  storage?.setItem(LEADER_TOKEN_KEY, token);
  storage?.setItem(LEADER_ID_KEY, leaderId);
}

export function clearLeaderAuth(): void {
  const storage = getStorage();
  storage?.removeItem(LEADER_TOKEN_KEY);
  storage?.removeItem(LEADER_ID_KEY);
}

export function getAdminToken(): string | null {
  const storage = getStorage();
  return storage?.getItem(ADMIN_TOKEN_KEY) ?? null;
}

export function getAdminRole(): string | null {
  const storage = getStorage();
  return storage?.getItem(ADMIN_ROLE_KEY) ?? null;
}

export function setAdminAuth(token: string, role: string): void {
  const storage = getStorage();
  storage?.setItem(ADMIN_TOKEN_KEY, token);
  storage?.setItem(ADMIN_ROLE_KEY, role);
}

export function clearAdminAuth(): void {
  const storage = getStorage();
  storage?.removeItem(ADMIN_TOKEN_KEY);
  storage?.removeItem(ADMIN_ROLE_KEY);
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

/** Check if current user is Super Admin (role === "1") */
export function isSuperAdmin(): boolean {
  return getAdminRole() === "1";
}

/** Guard function - redirects to login if not Super Admin */
export function requireSuperAdmin(router: { push: (href: string) => void }): boolean {
  const token = getAdminToken();
  const role = getAdminRole();

  if (!token || role !== "1") {
    clearAllAuth();
    router.push("/admin/login");
    return false;
  }
  return true;
}