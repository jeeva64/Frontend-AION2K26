'use client';

import { useState } from 'react';
import { useViewEventRegs } from '@/hooks/useViewEventRegs';
import { exportEventParticipants } from '@/lib/export';
import { aionAlert } from '@/lib/alerts';
import { EVENT_NAMES } from '@/lib/constants';
import { EVENT_SLOT_MAP } from '@/lib/constants/admin';
import { toast } from 'sonner';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import type { EventRegEntry } from '@/services/admin';

export function ViewEventPanel() {
  const { data, eventName, isLoading, isFetching, error, search, deleteByEvent } = useViewEventRegs();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!selectedEvent) {
      aionAlert.warning('Required', 'Event name is required');
      return;
    }
    setSearched(true);
    search(selectedEvent);
  };

  const handleRemoveFromEvent = async (leaderId: string, event: string) => {
    const result = await aionAlert.confirm({
      title: 'Remove Team from Event?',
      html: `<p>This will remove the team from <strong>&quot;${event}&quot;</strong>.</p>
             <p class="text-sm text-gray-500 mt-2">Note: If members have another event, they will still remain registered for that event.</p>`,
      icon: 'warning',
      confirmText: 'Yes, remove',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteByEvent({ leaderId, event });
      aionAlert.success('Removed!', res.message);
    } catch (err) {
      aionAlert.error('Error', err instanceof Error ? err.message : 'Failed to remove team from event');
    }
  };

  const handleExport = () => {
    if (!data?.length) {
      aionAlert.warning('No Data', 'No event data to export');
      return;
    }
    exportEventParticipants(data, eventName);
    toast.success('Event participants list exported!');
  };

  const totalParticipants = data?.reduce((sum, team) => sum + (team.members?.length || 0), 0) || 0;

  const selectClass =
    'h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-orbitron text-2xl font-bold text-aion-primary">View Event Registrations</h2>
        <p className="text-aion-muted text-sm mt-1">Search registrations by event</p>
      </div>

      <div className="bg-aion-card rounded-xl border border-aion p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <Field className="flex-1">
            <FieldLabel>Event Name</FieldLabel>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className={selectClass}
            >
              <option value="">Select Event</option>
              {EVENT_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name} ({EVENT_SLOT_MAP[name]})
                </option>
              ))}
            </select>
          </Field>
          <button
            onClick={handleSearch}
            disabled={isLoading || !selectedEvent}
            className="px-4 py-2 bg-aion-primary text-white text-sm rounded-lg font-medium hover:bg-aion-primary-hover transition disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? 'Searching...' : 'Search Event'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error.message}
        </div>
      )}

      {searched && !isLoading && data && (
        <>
          {data.length === 0 ? (
            <div className="bg-aion-card rounded-xl border border-aion p-12 text-center">
              <p className="text-aion-muted text-lg">No registrations found for this event</p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Event: {eventName}</h3>
                <div className="flex gap-6">
                  <div>
                    <p className="text-3xl font-bold">{data.length}</p>
                    <p className="text-sm opacity-80">Teams</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{totalParticipants}</p>
                    <p className="text-sm opacity-80">Participants</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-aion-card border border-aion text-aion-primary text-sm rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Export to Excel
                </button>
              </div>

              <div className="space-y-4">
                {data.map((team, teamIndex) => (
                  <TeamCard
                    key={team.leaderId}
                    team={team}
                    teamIndex={teamIndex}
                    eventName={eventName}
                    onRemove={handleRemoveFromEvent}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {isFetching && searched && (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-aion-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}

function TeamCard({
  team,
  teamIndex,
  eventName,
  onRemove,
}: {
  team: EventRegEntry;
  teamIndex: number;
  eventName: string;
  onRemove: (leaderId: string, event: string) => void;
}) {
  return (
    <div className="bg-aion-card rounded-xl border border-aion p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-aion-text">
            Team {teamIndex + 1}: {team.leaderId}
          </h3>
          <p className="text-sm text-aion-muted">{team.college}</p>
          <p className="text-xs text-aion-muted">Department: {team.department?.toUpperCase()}</p>
        </div>
        <button
          onClick={() => onRemove(team.leaderId || '', eventName)}
          className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg border border-red-200 hover:bg-red-100 transition"
        >
          Remove from Event
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-aion">
            <TableHead>S.No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Register No</TableHead>
            <TableHead>Degree</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Event 1</TableHead>
            <TableHead>Event 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {team.members?.map((member, idx) => (
            <TableRow key={member.registerNumber || idx}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell className="font-mono text-xs">{member.registerNumber}</TableCell>
              <TableCell>{member.degree?.toUpperCase()}</TableCell>
              <TableCell>{member.mobile || 'N/A'}</TableCell>
              <TableCell>
                {member.event1}
                {member.slot1 && <span className="text-xs text-aion-muted ml-1">(Slot {member.slot1})</span>}
              </TableCell>
              <TableCell>
                {member.event2 || 'N/A'}
                {member.slot2 && <span className="text-xs text-aion-muted ml-1">(Slot {member.slot2})</span>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
