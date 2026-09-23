"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MAX_STUDENTS_PER_LEADER } from "@/lib/constants";

interface StatsBannerProps {
  totalStudents: number;
  studentsRemaining: number;
  registrationDeadline?: string | null;
}

function formatDeadline(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function getDeadlineUrgency(iso: string): "passed" | "urgent" | "warning" | "safe" {
  const now = Date.now();
  const deadline = new Date(iso).getTime();
  if (deadline <= now) return "passed";
  const hoursLeft = (deadline - now) / (1000 * 60 * 60);
  if (hoursLeft < 24) return "urgent";
  if (hoursLeft < 72) return "warning";
  return "safe";
}

const DEADLINE_STYLES = {
  passed: { banner: "bg-red-50 border-red-300", text: "text-red-700", icon: "🚫" },
  urgent: { banner: "bg-red-50 border-red-400 animate-pulse", text: "text-red-700", icon: "⏰" },
  warning: { banner: "bg-yellow-50 border-yellow-400", text: "text-yellow-700", icon: "⏳" },
  safe: { banner: "bg-blue-50 border-blue-300", text: "text-blue-700", icon: "📅" },
} as const;

export function StatsBanner({
  totalStudents,
  studentsRemaining,
  registrationDeadline,
}: StatsBannerProps) {
  const remaining =
    studentsRemaining >= 0
      ? studentsRemaining
      : MAX_STUDENTS_PER_LEADER - totalStudents;

  const tone =
    remaining <= 3
      ? { banner: "bg-red-50 border-red-300", text: "text-red-700" }
      : remaining <= 7
        ? { banner: "bg-yellow-50 border-yellow-300", text: "text-yellow-700" }
        : { banner: "bg-green-50 border-green-300", text: "text-green-700" };

  const [deadlineUrgency, setDeadlineUrgency] = useState<"passed" | "urgent" | "warning" | "safe" | null>(null);

  useEffect(() => {
    if (!registrationDeadline) return;
    setDeadlineUrgency(getDeadlineUrgency(registrationDeadline));
    const interval = setInterval(() => {
      setDeadlineUrgency(getDeadlineUrgency(registrationDeadline));
    }, 60000);
    return () => clearInterval(interval);
  }, [registrationDeadline]);

  const deadlineStyle = deadlineUrgency ? DEADLINE_STYLES[deadlineUrgency] : null;
  const isClosed = deadlineUrgency === "passed";

  return (
    <div className="space-y-3">
      <div
        role="status"
        className={cn("rounded-lg border-2 p-4", isClosed ? "bg-red-50 border-red-400" : tone.banner)}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={cn("text-lg font-bold", isClosed ? "text-red-700" : tone.text)}>
              {isClosed ? "Registration Closed" : "Department Student Limit"}
            </p>
            <p className={cn("mt-1 text-sm", isClosed ? "text-red-600" : tone.text)}>
              {totalStudents} / {MAX_STUDENTS_PER_LEADER} students registered
              {!isClosed && (
                <span className="ml-2 font-semibold">
                  {remaining} slot{remaining !== 1 ? "s" : ""} remaining
                </span>
              )}
              {isClosed && (
                <span className="ml-2 font-semibold">
                  — deadline has passed
                </span>
              )}
            </p>
          </div>
          <div className={cn("text-3xl font-bold", isClosed ? "text-red-700" : tone.text)}>
            {totalStudents}/{MAX_STUDENTS_PER_LEADER}
          </div>
        </div>
      </div>

      {registrationDeadline && deadlineStyle && (
        <div
          role="status"
          className={cn("flex items-center gap-3 rounded-lg border-2 px-4 py-3", deadlineStyle.banner)}
        >
          <span className="text-xl">{deadlineStyle.icon}</span>
          <div className="flex-1">
            <p className={cn("text-sm font-bold", deadlineStyle.text)}>
              {isClosed ? "Registration Deadline Passed" : "Registration Deadline"}
            </p>
            <p className={cn("text-xs", deadlineStyle.text)}>
              {formatDeadline(registrationDeadline)}
            </p>
          </div>
          {!isClosed && (
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", deadlineStyle.banner, "border", deadlineStyle.text)}>
              {deadlineUrgency === "urgent" ? "Closing Soon!" : deadlineUrgency === "warning" ? "Closing in a few days" : "Open"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
