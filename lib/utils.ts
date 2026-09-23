import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupees(paise: number | null | undefined): string {
  if (paise === null || paise === undefined) return "--";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

export interface PaymentAmountInfo {
  paymentStatus?: string | null;
  expectedAmountPaises?: number | null;
  submittedAmountPaises?: number | null;
}

export function getOutstandingPaises(
  payment: PaymentAmountInfo | null | undefined,
  amountDuePaises: number
): number {
  if (!payment) return Math.max(0, amountDuePaises);
  const status = payment.paymentStatus;
  if (status === "VERIFICATION_PENDING") return 0;
  if (status === "SUCCESS") {
    const expected = payment.expectedAmountPaises ?? amountDuePaises;
    const submitted = payment.submittedAmountPaises ?? 0;
    return Math.max(0, expected - submitted);
  }
  return Math.max(0, amountDuePaises);
}

export function buildUpiUriWithAmount(
  uri: string | null,
  paise: number
): string | null {
  if (!uri || paise <= 0) return uri;
  try {
    const [head, query = ""] = uri.split("?");
    const params = new URLSearchParams(query);
    params.set("am", (paise / 100).toFixed(2));
    return `${head}?${params.toString()}`;
  } catch {
    return uri;
  }
}
