"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupees } from "@/lib/utils";

interface PaymentStatusCardProps {
  payment: {
    paymentStatus?: string | null;
    expectedAmountPaises?: number | null;
    submittedAmountPaises?: number | null;
    utr?: string | null;
    rejectionReason?: string | null;
  } | null;
  amountDuePaises: number;
  uniqueStudents: number;
  loading: boolean;
  onRefresh: () => void;
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
  uniqueStudents,
  loading,
  onRefresh,
}: PaymentStatusCardProps) {
  const status = payment?.paymentStatus ?? "PENDING";
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.PENDING;

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
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {status === "SUCCESS" ? "Paid Amount" : "Amount Due"}
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-700">{formatRupees(amountDuePaises)}</p>
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
      {status === "VERIFICATION_PENDING" && (
        <p className="mt-4 text-sm text-slate-600">
          UTR <span className="font-mono font-semibold">{payment?.utr}</span> is under
          review. Registration is confirmed only after an organizer verifies it.
        </p>
      )}
      {status === "PENDING" && (
        <p className="mt-4 text-sm text-slate-600">
          Register a team and complete the UPI payment to confirm your registration.
        </p>
      )}
    </div>
  );
}
