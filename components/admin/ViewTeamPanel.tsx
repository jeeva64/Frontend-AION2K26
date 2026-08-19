'use client';

import { Fragment, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useViewTeam } from '@/hooks/useViewTeam';
import { getLeaderCollegeDepts, type CollegeDepartments } from '@/services/admin';
import { getAdminToken } from '@/lib/auth';
import { exportTeamAttendance } from '@/lib/export';
import { aionAlert } from '@/lib/alerts';
import { DEPARTMENTS } from '@/lib/constants/admin';
import type { Department } from '@/lib/constants';
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
import type { RegisteredStudent } from '@/lib/types';

const DEPT_LABELS: Record<string, string> = Object.fromEntries(
  DEPARTMENTS.map((d) => [d.value, d.label])
);

interface LeaderGroup {
  leaderId: string;
  members: RegisteredStudent[];
}

function groupByLeader(data: RegisteredStudent[]): LeaderGroup[] {
  const map = new Map<string, RegisteredStudent[]>();
  for (const member of data) {
    const lid = member.leaderId || 'Unknown';
    if (!map.has(lid)) map.set(lid, []);
    map.get(lid)!.push(member);
  }
  return Array.from(map.entries()).map(([leaderId, members]) => ({
    leaderId,
    members,
  }));
}

export function ViewTeamPanel() {
  const { data, isLoading, isFetching, error, search, deleteTeam } = useViewTeam();
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState<Department | ''>('');
  const [searched, setSearched] = useState(false);

  const { data: collegeDepts = [], isLoading: loadingDropdowns } =
    useQuery<CollegeDepartments[], Error>({
      queryKey: ['admin', 'leaderCollegeDepts'],
      queryFn: () => {
        const token = getAdminToken();
        if (!token) throw new Error('No admin token');
        return getLeaderCollegeDepts(token);
      },
      staleTime: 60_000,
      retry: 1,
    });

  const availableDepartments: string[] = (() => {
    if (!college) return [];
    const match = collegeDepts.find((cd) => cd.college === college);
    return match ? match.departments : [];
  })();

  const handleCollegeChange = (value: string) => {
    setCollege(value);
    setDepartment('');
  };

  const handleSearch = () => {
    if (!college.trim() || !department) {
      aionAlert.warning('Required', 'All fields are required');
      return;
    }
    setSearched(true);
    search(college.trim(), department);
  };

  const handleDeleteTeam = async (leaderId: string) => {
    const result = await aionAlert.confirm({
      title: 'Delete Entire Team?',
      html: `<p class="text-red-600 font-semibold">This will delete ALL members registered under leader:</p>
             <p class="font-mono bg-gray-100 p-2 rounded mt-2">${leaderId}</p>
             <p class="mt-2 text-sm text-gray-600">This action cannot be undone!</p>`,
      icon: 'warning',
      confirmText: 'Yes, delete entire team',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteTeam(leaderId);
      aionAlert.success('Deleted!', res.message);
    } catch (err) {
      aionAlert.error('Error', err instanceof Error ? err.message : 'Failed to delete team');
    }
  };

  const handleExport = () => {
    if (!data?.length) {
      aionAlert.warning('No Data', 'No team data to export');
      return;
    }
    exportTeamAttendance(data, college.trim(), department);
    toast.success('Attendance sheet exported!');
  };

  const groups = data ? groupByLeader(data) : [];

  const selectClass =
    'h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-orbitron text-2xl font-bold text-aion-primary">View Team</h2>
        <p className="text-aion-muted text-sm mt-1">Search teams by college and department</p>
      </div>

      <div className="bg-aion-card rounded-xl border border-aion p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <Field className="flex-1">
            <FieldLabel>College Name</FieldLabel>
            <select
              value={college}
              onChange={(e) => handleCollegeChange(e.target.value)}
              disabled={loadingDropdowns}
              className={selectClass}
            >
              <option value="">
                {loadingDropdowns ? 'Loading colleges...' : 'Select College'}
              </option>
              {collegeDepts.map((cd) => (
                <option key={cd.college} value={cd.college}>
                  {cd.college}
                </option>
              ))}
            </select>
          </Field>
          <Field className="flex-1">
            <FieldLabel>Department</FieldLabel>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department | '')}
              disabled={!college || loadingDropdowns}
              className={selectClass}
            >
              <option value="">
                {!college ? 'Select college first' : 'Select Department'}
              </option>
              {availableDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {DEPT_LABELS[dept] || dept.toUpperCase()}
                </option>
              ))}
            </select>
          </Field>
          <button
            onClick={handleSearch}
            disabled={isLoading || !college || !department}
            className="px-4 py-2 bg-aion-primary text-white text-sm rounded-lg font-medium hover:bg-aion-primary-hover transition disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? 'Searching...' : 'Search Team'}
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
          <div className="flex justify-between items-center">
            <p className="text-aion-muted text-sm">
              Total: {data.length} member(s) across {groups.length} team(s)
            </p>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-aion-card border border-aion text-aion-primary text-sm rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Export to Excel
            </button>
          </div>

          {data.length === 0 ? (
            <div className="bg-aion-card rounded-xl border border-aion p-12 text-center">
              <p className="text-aion-muted text-lg">No team found for the specified criteria</p>
            </div>
          ) : (
            <div className="bg-aion-card rounded-xl border border-aion overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-aion">
                    <TableHead>S.No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Register No</TableHead>
                    <TableHead>Degree</TableHead>
                    <TableHead>Event 1</TableHead>
                    <TableHead>Event 2</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Food</TableHead>
                    <TableHead>Leader ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => (
                    <Fragment key={group.leaderId}>
                      <TableRow key={`header-${group.leaderId}`} className="bg-red-50 border-t-2 border-red-200 hover:bg-red-50">
                        <TableCell colSpan={9} className="!p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-sm font-semibold text-gray-900">Team Leader: </span>
                              <span className="font-mono text-sm text-gray-700">{group.leaderId}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({group.members.length} member{group.members.length > 1 ? 's' : ''})
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteTeam(group.leaderId)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg border border-red-200 hover:bg-red-100 transition"
                            >
                              Delete Entire Team
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {group.members.map((member, idx) => (
                        <TableRow key={member._id || `${group.leaderId}-${idx}`}>
                          <TableCell className="font-medium">{idx + 1}</TableCell>
                          <TableCell>{member.name || 'N/A'}</TableCell>
                          <TableCell className="font-mono text-xs">{member.registerNumber || 'N/A'}</TableCell>
                          <TableCell>{member.degree ? member.degree.toUpperCase() : 'N/A'}</TableCell>
                          <TableCell>
                            {member.event1 ? (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{member.event1}</span>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {member.event2 ? (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{member.event2}</span>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>{member.mobile || 'N/A'}</TableCell>
                          <TableCell>
                            {member.foodPreference === 'vegetarian' ? 'Veg' : member.foodPreference === 'non-vegetarian' ? 'Non-Veg' : 'N/A'}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{member.leaderId || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
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
