"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { StatsBanner } from "@/components/dashboard/stats-banner";
import { RegisteredMembersTable } from "@/components/dashboard/registered-members-table";
import { TeamRegistrationForm } from "@/components/dashboard/team-registration-form";
import { PaymentStatusCard } from "@/components/dashboard/payment-status-card";
import { PaymentDialog } from "@/components/dashboard/payment-dialog";
import { ApiError } from "@/lib/api-client";
import { getLeaderId, getLeaderToken, redirectToLogin } from "@/lib/auth";
import {
  EVENT_CONFIG,
  EVENT_NAMES,
  MAX_STUDENTS_PER_LEADER,
  SLOT_1_EVENTS,
  SLOT_2_EVENTS,
  type EventName,
} from "@/lib/constants";
import type { RegisteredStudent } from "@/lib/types";
import type { MyPaymentResponse } from "@/lib/types";
import { getOutstandingPaises } from "@/lib/utils";
import { getCandidates, getLeaderStats } from "@/services/team";
import { getMyPayment } from "@/services/payment";

const SLOT_1_TIME =
  EVENT_CONFIG[SLOT_1_EVENTS.find((e) => EVENT_CONFIG[e].slot === "1")!].time;
const SLOT_2_TIME =
  EVENT_CONFIG[SLOT_2_EVENTS.find((e) => EVENT_CONFIG[e].slot === "2")!].time;

export default function DashboardPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [leaderId, setLeaderId] = useState<string | null>(null);

  const [candidates, setCandidates] = useState<RegisteredStudent[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<EventName[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [studentsRemaining, setStudentsRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<MyPaymentResponse | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [statsDeadline, setStatsDeadline] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [payMode, setPayMode] = useState<"initial" | "supplementary">("initial");
  const autoTriggeredRef = useRef(false);

  const hasPendingRegistrations = useMemo(() => {
    return candidates.some((c) => c.status === "PAYMENT_PENDING");
  }, [candidates]);

  useEffect(() => {
    const t = getLeaderToken();
    const id = getLeaderId();
    if (!t || !id) {
      redirectToLogin(router);
      return;
    }
    setToken(t);
    setLeaderId(id);
    setAuthed(true);
  }, [router]);

  const loadData = useCallback(async () => {
    if (!token || !leaderId) return;
    setLoading(true);
    try {
      const [cands, stats] = await Promise.all([
        getCandidates(leaderId, token),
        getLeaderStats(leaderId, token),
      ]);
      const total = cands.totalStudents ?? cands.data?.length ?? 0;
      setCandidates(cands.data ?? []);
      setRegisteredEvents(cands.registeredEvents ?? []);
      setTotalStudents(total);
      setStudentsRemaining(
        stats.studentsRemaining ?? MAX_STUDENTS_PER_LEADER - total
      );
      setStatsDeadline(stats.registrationDeadline ?? null);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        redirectToLogin(router);
        return;
      }
      toast.error(
        error instanceof Error ? error.message : "Failed to load your teams."
      );
    } finally {
      setLoading(false);
    }
  }, [token, leaderId, router]);

  useEffect(() => {
    if (authed && token && leaderId) {
      void loadData();
    }
  }, [authed, token, leaderId, loadData]);

  const loadPayment = useCallback(async () => {
    if (!token) return;
    setPaymentLoading(true);
    try {
      setPaymentInfo(await getMyPayment(token));
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        setPaymentInfo(null);
      }
    } finally {
      setPaymentLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (authed && token && leaderId) {
      void loadPayment();
    }
  }, [authed, token, leaderId, loadPayment]);

  const refreshAll = useCallback(() => {
    void loadData();
    void loadPayment();
  }, [loadData, loadPayment]);

  const registrationDeadline = paymentInfo?.registrationDeadline ?? statsDeadline;

  const paymentData = paymentInfo?.data ?? null;
  const outstandingPaises = getOutstandingPaises(
    paymentData,
    paymentInfo?.amountDuePaises ?? 0
  );

  const openPayDialog = useCallback(() => {
    if (outstandingPaises <= 0) return;
    setPayMode(
      paymentData?.paymentStatus === "SUCCESS" ? "supplementary" : "initial"
    );
    autoTriggeredRef.current = true;
    setPaymentDialogOpen(true);
  }, [outstandingPaises, paymentData]);

  useEffect(() => {
    if (!paymentData) return;
    const status = paymentData.paymentStatus;
    if (status === "VERIFICATION_PENDING" || outstandingPaises <= 0) {
      autoTriggeredRef.current = false;
      return;
    }
    const capReached =
      studentsRemaining !== null &&
      studentsRemaining <= 0 &&
      totalStudents > 0;
    const allEventsRegistered = registeredEvents.length === EVENT_NAMES.length;
    if (
      (capReached || allEventsRegistered) &&
      !autoTriggeredRef.current &&
      !paymentDialogOpen
    ) {
      openPayDialog();
    }
  }, [
    paymentData,
    outstandingPaises,
    studentsRemaining,
    totalStudents,
    registeredEvents,
    paymentDialogOpen,
    openPayDialog,
  ]);

  const studentMap = useMemo(() => {
    const map: Record<string, RegisteredStudent> = {};
    for (const doc of candidates) {
      map[doc.registerNumber] = doc;
    }
    return map;
  }, [candidates]);

  const handleUnauthorized = useCallback(() => {
    redirectToLogin(router);
  }, [router]);

  if (!authed) {
    return null;
  }

  return (
    <>
      <DashboardNav />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-4 pt-20">
        <div className="mx-auto max-w-7xl space-y-8 py-8">
          <div className="mb-8 text-center">
            <h1 className="mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
              Student Leader Dashboard
            </h1>
            <p className="text-lg text-slate-600">
              Manage your team registrations and event schedules
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-white/50 bg-white/90 p-6 shadow-lg backdrop-blur">
            <h3 className="mb-4 text-center text-2xl font-bold">
              Event Schedule
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-lg font-bold">Slot 1</h4>
                  <span className="slot-badge slot-1">{SLOT_1_TIME}</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    Fixathon
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    Bid Mayhem (Prelims)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    Mute Masters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    Treasure Titans
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-lg font-bold">Slot 2</h4>
                  <span className="slot-badge slot-2">{SLOT_2_TIME}</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-pink-500"></span>
                    QRush
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-pink-500"></span>
                    VisionX
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-pink-500"></span>
                    ThinkSync
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-pink-500"></span>
                    Crazy Sell
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
              <p className="mb-1 text-sm font-semibold text-yellow-800">
                ⚠️ Important Note:
              </p>
              <p className="text-xs text-yellow-700">
                Participants in <strong>Bid Mayhem</strong> cannot register for
                any other events as it spans both slots (Prelims in Slot 1,
                Mains in Slot 2).
              </p>
            </div>
          </div>

          <StatsBanner
            totalStudents={totalStudents}
            studentsRemaining={studentsRemaining ?? MAX_STUDENTS_PER_LEADER - totalStudents}
            registrationDeadline={registrationDeadline}
          />

          <PaymentStatusCard
            payment={paymentInfo?.data ?? null}
            amountDuePaises={paymentInfo?.amountDuePaises ?? 0}
            outstandingPaises={outstandingPaises}
            uniqueStudents={paymentInfo?.uniqueStudents ?? 0}
            loading={paymentLoading}
            onRefresh={() => void loadPayment()}
            hasPendingRegistrations={hasPendingRegistrations}
            onPay={openPayDialog}
          />

          <TeamRegistrationForm
            leaderId={leaderId ?? ""}
            token={token ?? ""}
            studentMap={studentMap}
            registeredEvents={registeredEvents}
            totalStudents={totalStudents}
            registrationDeadline={registrationDeadline}
            onRegistered={() => refreshAll()}
            onUnauthorized={handleUnauthorized}
          />

          <RegisteredMembersTable
            candidates={candidates}
            loading={loading}
          />
        </div>
      </main>

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        token={token ?? ""}
        leaderId={leaderId ?? ""}
        amountPaises={outstandingPaises}
        upiUri={paymentInfo?.upiUri ?? null}
        memberCount={paymentInfo?.uniqueStudents ?? 0}
        onSubmitted={refreshAll}
        isSupplementary={payMode === "supplementary"}
      />
    </>
  );
}
