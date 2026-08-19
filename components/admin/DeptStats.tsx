'use client';

import { DEPARTMENTS } from '@/lib/constants/admin';

interface DeptStatsProps {
  deptCounts: Record<string, number>;
  totalMembers: number;
}

const DEPT_COLORS: Record<string, string> = {
  cs: 'bg-blue-500',
  ds: 'bg-green-500',
  ai: 'bg-purple-500',
  it: 'bg-orange-500',
  ca: 'bg-pink-500'
};

export function DeptStats({ deptCounts, totalMembers }: DeptStatsProps) {
  return (
    <div className="bg-aion-card rounded-xl border border-aion p-6">
      <h3 className="font-orbitron text-lg font-semibold text-aion-primary mb-4">🏢 Department-wise Distribution</h3>
      <div className="space-y-3">
        {DEPARTMENTS.map(({ value, label }) => {
          const count = deptCounts[value] || 0;
          const percentage = totalMembers > 0 ? ((count / totalMembers) * 100).toFixed(1) : '0.0';
          const colorClass = DEPT_COLORS[value] || 'bg-gray-500';
          
          return (
            <div key={value} className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-aion-text font-rajdhani">{label}</span>
                <span className="text-sm text-aion-muted font-rajdhani">{count} ({percentage}%)</span>
              </div>
              <div className="w-full bg-aion-border rounded-full h-2">
                <div 
                  className={`${colorClass} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}