'use client';

interface DegreeStatsProps {
  ugCount: number;
  pgCount: number;
}

export function DegreeStats({ ugCount, pgCount }: DegreeStatsProps) {
  return (
    <div className="bg-aion-card rounded-xl border border-aion p-6">
      <h3 className="font-orbitron text-lg font-semibold text-aion-primary mb-4">🎓 Degree-wise Distribution</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold font-orbitron text-sm">UG</div>
            <span className="font-medium text-aion-text font-rajdhani">Undergraduate</span>
          </div>
          <span className="text-2xl font-bold text-blue-600 font-orbitron">{ugCount}</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold font-orbitron text-sm">PG</div>
            <span className="font-medium text-aion-text font-rajdhani">Postgraduate</span>
          </div>
          <span className="text-2xl font-bold text-purple-600 font-orbitron">{pgCount}</span>
        </div>
      </div>
    </div>
  );
}