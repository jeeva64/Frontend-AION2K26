import { API_BASE } from "@/lib/constants";
import { api } from "@/lib/api-client";
import type {
  MyPaymentResponse,
  PaymentAuditEntry,
  PaymentDetail,
  PaymentSummaryRow,
} from "@/lib/types";

export interface RegisterTeamPaymentInfo {
  paymentId?: number;
  paymentStatus?: string;
  uniqueStudents?: number;
  amountDuePaises?: number;
  currency?: string;
  upiUri?: string | null;
}

export async function getMyPayment(token: string): Promise<MyPaymentResponse> {
  const body = await api<unknown>("/payments/mine", { method: "GET", token });
  const raw = body as unknown as MyPaymentResponse;
  return {
    success: body.success,
    message: body.message,
    uniqueStudents: raw.uniqueStudents ?? 0,
    amountDuePaises: raw.amountDuePaises ?? 0,
    upiUri: raw.upiUri ?? null,
    data: raw.data ?? null,
  };
}

export async function submitPaymentProof(
  token: string,
  input: { utr: string; amountPaises: number; screenshot: File }
): Promise<{ paymentId: number; paymentStatus: string }> {
  const form = new FormData();
  form.append("utr", input.utr.trim());
  form.append("amountPaises", String(input.amountPaises));
  form.append("screenshot", input.screenshot);

  const body = await api<unknown>("/payments/proof", {
    method: "POST",
    token,
    rawBody: form,
  });
  const raw = body as unknown as { paymentId: number; paymentStatus: string };
  return { paymentId: raw.paymentId, paymentStatus: raw.paymentStatus };
}

export async function listPayments(
  token: string,
  status?: string
): Promise<PaymentSummaryRow[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const body = await api<unknown>(`/admin/payments${query}`, { method: "GET", token });
  const raw = body as unknown as { count: number; data: PaymentSummaryRow[] };
  return raw.data ?? [];
}

export async function getPaymentDetail(
  token: string,
  paymentId: number
): Promise<{ data: PaymentDetail; audit: PaymentAuditEntry[] }> {
  const body = await api<{
    data: PaymentDetail;
    audit: PaymentAuditEntry[];
  }>(`/admin/payments/${paymentId}`, { method: "GET", token });
  const raw = body as unknown as {
    data: PaymentDetail;
    audit: PaymentAuditEntry[];
  };
  return { data: raw.data, audit: raw.audit ?? [] };
}

export async function getPaymentProof(
  token: string,
  paymentId: number
): Promise<{ url: string; mimeType?: string | null; originalFilename?: string | null }> {
  const body = await api<unknown>(`/admin/payments/${paymentId}/proof`, {
    method: "GET",
    token,
  });
  const raw = body as unknown as {
    url: string;
    expiresIn: number;
    mimeType?: string | null;
    originalFilename?: string | null;
  };
  const url = raw.url.startsWith("http")
    ? raw.url
    : `${API_BASE}${raw.url}`;
  return {
    url,
    mimeType: raw.mimeType,
    originalFilename: raw.originalFilename,
  };
}

async function paymentAction(
  token: string,
  paymentId: number,
  action: "verify" | "reject" | "reopen",
  reason?: string
): Promise<{ paymentStatus: string }> {
  const body = await api<unknown>(`/admin/payments/${paymentId}/${action}`, {
    method: "POST",
    token,
    body: reason !== undefined ? { reason } : undefined,
  });
  const raw = body as unknown as { paymentStatus: string };
  return { paymentStatus: raw.paymentStatus };
}

export function verifyPayment(token: string, paymentId: number) {
  return paymentAction(token, paymentId, "verify");
}

export function rejectPayment(token: string, paymentId: number, reason: string) {
  return paymentAction(token, paymentId, "reject", reason);
}

export function reopenPayment(token: string, paymentId: number) {
  return paymentAction(token, paymentId, "reopen");
}
