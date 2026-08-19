'use client';

import { CollegeStat } from '@/lib/types';
import { exportCollegeStats } from '@/lib/export';
import { aionAlert } from '@/lib/alerts';

interface CollegeStatsTableProps {
  data: CollegeStat[];
}

export function CollegeStatsTable({ data }: CollegeStatsTableProps) {
  const handleExport = () => {
    if (!data.length) {
      aionAlert.warning('No Data', 'No college stats to export');
      return;
    }
    exportCollegeStats(data);
    aionAlert.success('Success', 'College stats exported!');
  };

  if (!data.length) {
    return (
      <div className="text-center py-8 text-aion-muted">
        <p>No registrations found</p>
      </div>
    );
  }

  // Sort by member count descending
  const sortedData = [...data].sort((a, b) => b.members - a.members);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead className="bg-aion-border/50 border-b border-aion">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-aion-primary uppercase tracking-wider">S.No</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-aion-primary uppercase tracking-wider">College Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-aion-primary uppercase tracking-wider">Department</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-aion-primary uppercase tracking-wider">Members</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-aion-primary uppercase tracking-wider">Veg</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-aion-primary uppercase tracking-wider">Non-Veg</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-aion-border/50">
          {sortedData.map((stat, index) => (
            <tr key={`${stat.college}-${stat.department}`} className="hover:bg-aion-border/30 transition-colors">
              <td className="px-4 py-3 text-sm text-aion-muted font-rajdhani">{index + 1}</td>
              <td className="px-4 py-3 text-sm text-aion-text font-rajdhani">{stat.college}</td>
              <td className="px-4 py-3 text-sm text-aion-muted uppercase font-rajdhani">{stat.department}</td>
              <td className="px-4 py-3 text-sm font-semibold text-aion-primary font-orbitron">{stat.members}</td>
              <td className="px-4 py-3 text-sm">
                <span className="px-2 py-1 bg-aion-success-light text-aion-success rounded-full text-xs border border-aion-success/30">{stat.veg}</span>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="px-2 py-1 bg-aion-warning-light text-aion-warning rounded-full text-xs border border-aion-warning/30">{stat.nonVeg}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}