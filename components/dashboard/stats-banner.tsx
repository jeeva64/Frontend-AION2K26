"use client";

import { cn } from "@/lib/utils";
import { MAX_STUDENTS_PER_LEADER } from "@/lib/constants";

interface StatsBannerProps {
  totalStudents: number;
  studentsRemaining: number;
}

export function StatsBanner({
  totalStudents,
  studentsRemaining,
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

  return (
    <div
      role="status"
      className={cn("rounded-lg border-2 p-4", tone.banner)}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className={cn("text-lg font-bold", tone.text)}>
            Department Student Limit
          </p>
          <p className={cn("mt-1 text-sm", tone.text)}>
            {totalStudents} / {MAX_STUDENTS_PER_LEADER} students registered
            <span className="ml-2 font-semibold">
              {remaining} slot{remaining !== 1 ? "s" : ""} remaining
            </span>
          </p>
        </div>
        <div className={cn("text-3xl font-bold", tone.text)}>
          {totalStudents}/{MAX_STUDENTS_PER_LEADER}
        </div>
      </div>
    </div>
  );
}
