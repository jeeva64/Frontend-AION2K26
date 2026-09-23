"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PaymentInfo } from "@/lib/types";
import { formatRupees } from "@/lib/utils";

interface PaymentStatusCardProps {
  payment: PaymentInfo | null;
  amountDuePaises: number;
  outstandingPaises: number;
  uniqueStudents: number;
  loading: boolean;
  onRefresh: () => void;
  onPay: () => void;
  hasPendingRegistrations?: boolean;
}

const STATUS_STYLES: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  PENDING: {
    label: "Payment Pending",
    variant: "outline",
    className: "border-yellow-500 text-yellow-700 bg-yellow-50",
  },
  VERIFICATION_PENDING: {
    label: "Verification Pending",
    variant: "default",
    className: "bg-blue-600 text-white",
  },
  SUCCESS: {
    label: "Payment Verified",
    variant: "default",
    className: "bg-green-600 text-white",
  },
  REJECTED: {
    label: "Payment Rejected",
    variant: "destructive",
    className: "",
  },
};

export function PaymentStatusCard({
  payment,
  amountDuePaises,
  outstandingPaises,
  uniqueStudents,
  loading,
  onRefresh,
  onPay,
  hasPendingRegistrations,
}: PaymentStatusCardProps) {
  const status = payment?.paymentStatus ?? "PENDING";
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.PENDING;
  const hasRegistrations = uniqueStudents > 0;
  const showPay =
    hasRegistrations &&
    outstandingPaises > 0 &&
    status !== "VERIFICATION_PENDING";

  const payLabel =
    status === "REJECTED"
      ? `Resubmit Payment · ${formatRupees(outstandingPaises)}`
      : status === "SUCCESS"
        ? `Pay Balance · ${formatRupees(outstandingPaises)}`
        : `Pay Now · ${formatRupees(outstandingPaises)}`;

  return (
    <div className="rounded-2xl border border-white/50 bg-white/90 p-6 shadow-lg backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-bold">Registration Payment</h3>
        <Button type="button" variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          Refresh
        </Button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Unique Students</p>
          <p className="mt-1 text-2xl font-bold">{uniqueStudents}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Amount Due Now</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">{formatRupees(outstandingPaises)}</p>
          <p className="mt-1 text-xs text-slate-500">
            of {formatRupees(amountDuePaises)} total{hasRegistrations ? ` · ${uniqueStudents} members` : ""}
          </p>
        </div>
        <div className="flex flex-col justify-center rounded-xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
          {loading ? (
            <p className="mt-1 text-sm text-slate-400">Loading...</p>
          ) : (
            <Badge variant={style.variant} className={`mt-1 w-fit ${style.className}`}>
              {style.label}
            </Badge>
          )}
        </div>
      </div>

      {status === "REJECTED" && payment?.rejectionReason && (
        <div className="mt-4 rounded-lg border-l-4 border-red-400 bg-red-50 p-3 text-sm text-red-800">
          <strong>Rejected:</strong> {payment.rejectionReason} — please submit a new
          proof with the correct details.
        </div>
      )}

      {showPay && (
        <Button
          type="button"
          onClick={onPay}
          className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-base text-white"
        >
          {payLabel}
        </Button>
      )}

      {status === "VERIFICATION_PENDING" && (
        <div className="mt-4 rounded-lg border-l-4 border-blue-400 bg-blue-50 p-3 text-sm text-blue-800">
          <p>
            Your proof (UTR <span className="font-mono font-semibold">{payment?.utr}</span>)
            is under review — <strong>no payment is needed now</strong>.
          </p>
          {hasPendingRegistrations && (
            <p className="mt-1 text-xs text-blue-700">
              You added members after submitting — your remaining balance will be
              shown once the organizer verifies the current proof.
            </p>
          )}
        </div>
      )}

      {status === "PENDING" && (
        <p className="mt-4 text-sm text-slate-600">
          {hasRegistrations
            ? "Your teams are saved. Click Pay Now whenever you are ready to complete the payment."
            : "Add your team registration above first, then complete the payment."}
        </p>
      )}

      {status === "SUCCESS" && outstandingPaises <= 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-green-700">
            Payment verified — your registrations are confirmed.
          </p>
          {hasPendingRegistrations && (
            <p className="text-sm text-amber-700">
              You have registrations awaiting verification by the organizer.
            </p>
          )}
        </div>
      )}
    </div>
  );
}