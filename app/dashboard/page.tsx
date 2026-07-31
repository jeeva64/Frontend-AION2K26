"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { StatsBanner } from "@/components/dashboard/stats-banner";
import { RegisteredMembersTable } from "@/components/dashboard/registered-members-table";
import { TeamRegistrationForm } from "@/components/dashboard/team-registration-form";
import { ApiError } from "@/lib/api-client";
import { getLeaderId, getLeaderToken, redirectToLogin } from "@/lib/auth";
import { MAX_STUDENTS_PER_LEADER, type EventName } from "@/lib/constants";
import type { RegisteredStudent } from "@/lib/types";
import { getCandidates, getLeaderStats } from "@/services/team";

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
                  <span className="slot-badge slot-1">10:30 AM - 12:30 PM</span>
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
                  <span className="slot-badge slot-2">1:30 PM - 3:30 PM</span>
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
          />

          <TeamRegistrationForm
            leaderId={leaderId ?? ""}
            token={token ?? ""}
            studentMap={studentMap}
            registeredEvents={registeredEvents}
            totalStudents={totalStudents}
            onRegistered={() => void loadData()}
            onUnauthorized={handleUnauthorized}
          />

          <RegisteredMembersTable
            candidates={candidates}
            loading={loading}
          />
        </div>
      </main>
    </>
  );
}
