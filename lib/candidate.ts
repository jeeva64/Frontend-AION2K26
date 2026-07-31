import {
  EVENT_CONFIG,
  MAX_EVENTS_PER_STUDENT,
  MAX_STUDENTS_PER_LEADER,
  type EventName,
} from "@/lib/constants";
import type { RegisteredStudent } from "@/lib/types";

export interface ConflictResult {
  hasConflict: boolean;
  message: string;
}

export function checkParticipantConflict(
  student: RegisteredStudent | undefined,
  selectedEvent: EventName
): ConflictResult {
  if (!student) return { hasConflict: false, message: "" };

  const selectedSlot = EVENT_CONFIG[selectedEvent].slot;

  if (student.event1 === "Bid Mayhem" || student.event2 === "Bid Mayhem") {
    return {
      hasConflict: true,
      message: "Already in Bid Mayhem (blocks all other events)",
    };
  }
  if (selectedEvent === "Bid Mayhem" && student.event1) {
    return {
      hasConflict: true,
      message: `Already in ${student.event1}${
        student.event2 ? " & " + student.event2 : ""
      }. Bid Mayhem cannot be combined.`,
    };
  }
  if (student.event2) {
    return {
      hasConflict: true,
      message: `Already in 2 events: ${student.event1} & ${student.event2}`,
    };
  }
  if (student.slot1 === selectedSlot) {
    return {
      hasConflict: true,
      message: `Time conflict with ${student.event1} (same slot)`,
    };
  }
  return { hasConflict: false, message: "" };
}

export function isMobileValid(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile);
}

export function getTeamLimitExceededMessage(
  totalStudents: number,
  newStudents: number
): string | null {
  if (totalStudents + newStudents > MAX_STUDENTS_PER_LEADER) {
    return `Would exceed the 15-student limit. Current: ${totalStudents} | New in this team: ${newStudents} | Available: ${MAX_STUDENTS_PER_LEADER - totalStudents}`;
  }
  return null;
}

export function getMaxEventsMessage(): string {
  return `Already in ${MAX_EVENTS_PER_STUDENT} events. Only ${MAX_EVENTS_PER_STUDENT} events per student are allowed.`;
}
