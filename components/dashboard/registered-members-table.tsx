"use client";

import type { EventName, EventSlot } from "@/lib/constants";
import type { RegisteredStudent } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FoodBadge } from "@/components/dashboard/food-badge";

interface TeamGroup {
  event: EventName;
  slot: EventSlot;
  participants: RegisteredStudent[];
}

function groupByEvent(candidates: RegisteredStudent[]): TeamGroup[] {
  const teams: Record<string, TeamGroup> = {};

  for (const doc of candidates) {
    for (const entry of [
      { event: doc.event1, slot: doc.slot1 },
      { event: doc.event2, slot: doc.slot2 },
    ]) {
      if (!entry.event || !entry.slot) continue;
      if (!teams[entry.event]) {
        teams[entry.event] = { event: entry.event, slot: entry.slot, participants: [] };
      }
      teams[entry.event].participants.push(doc);
    }
  }

  return Object.values(teams);
}

function SlotBadge({ slot }: { slot: EventSlot }) {
  if (slot === "1") {
    return (
      <span className="slot-badge slot-1">Slot 1</span>
    );
  }
  if (slot === "2") {
    return (
      <span className="slot-badge slot-2">Slot 2</span>
    );
  }
  return (
    <span
      className="slot-badge"
      style={{ background: "linear-gradient(135deg,#667eea 0%,#f5576c 100%)", color: "white" }}
    >
      Both Slots
    </span>
  );
}

interface RegisteredMembersTableProps {
  candidates: RegisteredStudent[];
  loading: boolean;
}

export function RegisteredMembersTable({
  candidates,
  loading,
}: RegisteredMembersTableProps) {
  const teams = groupByEvent(candidates);

  return (
    <div className="overflow-x-auto rounded-2xl bg-white/90 p-6 shadow-lg backdrop-blur">
      <h2 className="mb-6 text-center text-3xl font-bold">
        Registered Members
      </h2>

      {loading ? (
        <div className="space-y-3" aria-label="Loading registered teams">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : teams.length === 0 ? (
        <p className="py-8 text-center text-slate-500">
          No teams registered yet. Start by adding your first team!
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-[#667eea] to-[#764ba2]">
              <TableHead className="text-white">S.NO</TableHead>
              <TableHead className="text-white">Event</TableHead>
              <TableHead className="text-white">Slot</TableHead>
              <TableHead className="text-white">Participants</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team, index) => (
              <TableRow key={team.event}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-semibold">{team.event}</TableCell>
                <TableCell>
                  <SlotBadge slot={team.slot} />
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    {team.participants.map((p) => (
                      <div key={p.registerNumber}>
                        <div className="text-sm font-semibold">{p.name}</div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-slate-600">
                          {p.registerNumber}
                          <span className="inline-block rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-semibold text-indigo-700 uppercase">
                            {p.degree}
                          </span>
                          {p.foodPreference && (
                            <FoodBadge preference={p.foodPreference} />
                          )}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          📞 {p.mobile || "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
