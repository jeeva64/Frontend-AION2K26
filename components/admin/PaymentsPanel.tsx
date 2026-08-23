'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aionAlert } from '@/lib/alerts';
import { getAdminToken } from '@/lib/auth';
import { formatRupees } from '@/lib/utils';
import {
  getPaymentDetail,
  getPaymentProof,
  listPayments,
  rejectPayment,
  reopenPayment,
  verifyPayment,
} from '@/services/payment';
import type { PaymentAuditEntry, PaymentDetail, PaymentSummaryRow } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const STATUS_FILTERS = ['ALL', 'PENDING', 'VERIFICATION_PENDING', 'SUCCESS', 'REJECTED'] as const;

const STATUS_BADGE: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  VERIFICATION_PENDING: 'bg-blue-100 text-blue-800 border-blue-300',
  SUCCESS: 'bg-green-100 text-green-800 border-green-300',
  REJECTED: 'bg-red-100 text-red-800 border-red-300',
};

const ACTION_LABELS: Record<string, string> = {
  CREATED: 'Created',
  PROOF_SUBMITTED: 'Proof Submitted',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
  REOPENED: 'Reopened',
};

export function PaymentsPanel() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>('VERIFICATION_PENDING');
  const [detail, setDetail] = useState<{ payment: PaymentDetail; audit: PaymentAuditEntry[]; proofUrl: string | null } | null>(null);

  const query = useQuery<PaymentSummaryRow[], Error>({
    queryKey: ['admin', 'payments', statusFilter],
    queryFn: () => {
      const token = getAdminToken();
      if (!token) throw new Error('No admin token');
      return listPayments(token, statusFilter === 'ALL' ? undefined : statusFilter);
    },
    staleTime: 15000,
    retry: 1,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'payments'] });
  };

  const handleVerify = async (paymentId: number) => {
    const token = getAdminToken();
    if (!token) return;
    const result = await aionAlert.confirm({
      title: 'Verify Payment?',
      html: '<p>This will <strong>confirm the registration</strong> for this leader.</p>',
      icon: 'question',
      confirmText: 'Yes, verify',
    });
    if (!result.isConfirmed) return;
    try {
      await verifyPayment(token, paymentId);
      aionAlert.success('Verified!', 'Registration confirmed.');
      invalidate();
    } catch (err) {
      aionAlert.error('Error', err instanceof Error ? err.message : 'Verification failed');
    }
  };

  const handleReject = async (paymentId: number) => {
    const token = getAdminToken();
    if (!token) return;
    const result = await aionAlert.input({
      title: 'Reject Payment',
      placeholder: 'Reason shown to the leader',
      confirmText: 'Reject',
      inputValidator: (value: string) =>
        !value || !value.trim() ? 'Rejection reason is required' : null,
    });
    const reason = typeof result.value === 'string' ? result.value.trim() : '';
    if (!result.isConfirmed || !reason) return;
    try {
      await rejectPayment(token, paymentId, reason);
      aionAlert.success('Rejected', 'The leader may resubmit proof.');
      invalidate();
    } catch (err) {
      aionAlert.error('Error', err instanceof Error ? err.message : 'Rejection failed');
    }
  };

  const handleReopen = async (paymentId: number) => {
    const token = getAdminToken();
    if (!token) return;
    const result = await aionAlert.confirm({
      title: 'Reopen Payment?',
      html: '<p>Puts this payment back into <strong>Verification Pending</strong>.</p>',
      icon: 'warning',
      confirmText: 'Reopen',
    });
    if (!result.isConfirmed) return;
    try {
      await reopenPayment(token, paymentId);
      aionAlert.success('Reopened', 'Payment is back under review.');
      invalidate();
    } catch (err) {
      aionAlert.error('Error', err instanceof Error ? err.message : 'Reopen failed');
    }
  };

  const openDetail = async (paymentId: number) => {
    const token = getAdminToken();
    if (!token) return;
    try {
      const [d, proof] = await Promise.all([
        getPaymentDetail(token, paymentId),
        getPaymentProof(token, paymentId).catch(() => null),
      ]);
      let proofUrl: string | null = null;
      if (proof) {
        const res = await fetch(proof.url, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const blob = await res.blob();
          proofUrl = URL.createObjectURL(blob);
        }
      }
      setDetail({ payment: d.data, audit: d.audit, proofUrl });
    } catch (err) {
      aionAlert.error('Error', err instanceof Error ? err.message : 'Failed to load payment');
    }
  };

  const rows = query.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-orbitron text-2xl font-bold text-aion-primary">Payment Verification</h2>
        <p className="text-aion-muted text-sm mt-1">Review UPI payment proofs and confirm registrations</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
              statusFilter === s
                ? 'border-aion-primary bg-aion-primary text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:border-aion-primary'
            }`}
          >
            {s === 'ALL' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {query.isLoading ? (
        <div className="py-10 text-center text-sm text-slate-400">Loading payments...</div>
      ) : query.error ? (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{query.error.message}</div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
          No payments found for this filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leader</TableHead>
                <TableHead>College / Dept</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Difference</TableHead>
                <TableHead>UTR</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => {
                const expected = p.expectedAmountPaises ?? 0;
                const submitted = p.submittedAmountPaises;
                const diff = submitted === null || submitted === undefined ? null : submitted - expected;
                return (
                  <TableRow key={p._id}>
                    <TableCell>
                      <div className="font-medium">{p.leaderName ?? '-'}</div>
                      <div className="font-mono text-xs text-slate-500">{p.leaderId}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{p.leaderCollege ?? '-'}</div>
                      <div className="text-xs uppercase text-slate-500">{p.leaderDepartment ?? ''}</div>
                    </TableCell>
                    <TableCell className="font-semibold">{formatRupees(expected)}</TableCell>
                    <TableCell>{formatRupees(submitted)}</TableCell>
                    <TableCell>
                      {diff === null || diff === 0 ? (
                        <span className="text-green-600">Match</span>
                      ) : (
                        <span className="font-semibold text-red-600">{diff > 0 ? '+' : ''}{formatRupees(diff)}</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{p.utr ?? '-'}</TableCell>
                    <TableCell>
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[p.paymentStatus ?? ''] ?? ''}`}>
                        {(p.paymentStatus ?? '').replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => void openDetail(p._id)}
                          className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
                        >
                          View
                        </button>
                        {p.paymentStatus === 'VERIFICATION_PENDING' && (
                          <>
                            <button
                              type="button"
                              onClick={() => void handleVerify(p._id)}
                              className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                            >
                              Verify
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleReject(p._id)}
                              className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {p.paymentStatus === 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => void handleReopen(p._id)}
                            className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                          >
                            Reopen
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-xl font-bold">
                Payment Detail{' '}
                <span className={`ml-2 inline-block rounded-full border px-2.5 py-0.5 align-middle text-xs ${STATUS_BADGE[detail.payment.paymentStatus ?? ''] ?? ''}`}>
                  {(detail.payment.paymentStatus ?? '').replace('_', ' ')}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  if (detail.proofUrl) URL.revokeObjectURL(detail.proofUrl);
                  setDetail(null);
                }}
                className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
              >
                Close ✕
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 text-sm">
                <p><span className="text-slate-500">Leader:</span> {detail.payment.leaderName} ({detail.payment.leaderId})</p>
                <p><span className="text-slate-500">College:</span> {detail.payment.leaderCollege} / {detail.payment.leaderDepartment?.toUpperCase()}</p>
                <p><span className="text-slate-500">Expected:</span> {formatRupees(detail.payment.expectedAmountPaises)}</p>
                <p><span className="text-slate-500">Submitted:</span> {formatRupees(detail.payment.submittedAmountPaises)}</p>
                <p><span className="text-slate-500">UTR:</span> <span className="font-mono">{detail.payment.utr}</span></p>
                {detail.payment.rejectionReason && (
                  <p className="text-red-700"><span className="text-slate-500">Rejection reason:</span> {detail.payment.rejectionReason}</p>
                )}
                {detail.payment.verifiedBy && (
                  <p className="text-green-700"><span className="text-slate-500">Verified by:</span> {detail.payment.verifierName ?? detail.payment.verifiedBy}</p>
                )}
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">Proof Screenshot</p>
                {detail.proofUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={detail.proofUrl} alt="Payment proof" className="max-h-72 w-full rounded-lg border object-contain" />
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-slate-400">
                    No proof uploaded
                  </div>
                )}
              </div>
            </div>

            <h4 className="mt-5 mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Audit Trail</h4>
            <ol className="space-y-1.5">
              {detail.audit.map((a) => (
                <li key={a.auditId} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span className="font-semibold">{ACTION_LABELS[a.action] ?? a.action}</span>
                  {a.oldStatus && a.newStatus && (
                    <span className="text-slate-500"> · {a.oldStatus.replace('_', ' ')} → {a.newStatus.replace('_', ' ')}</span>
                  )}
                  {a.reason && <span className="text-red-600"> · “{a.reason}”</span>}
                  {a.adminId && <span className="text-slate-500"> · by {a.adminId}</span>}
                  <span className="float-right text-xs text-slate-400">{new Date(a.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
