'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: ReactNode;
  gradient: string;
}

export function StatCard({ title, value, subtitle, icon, gradient }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-lg p-6 text-white relative overflow-hidden`}>
      {/* Animated glow line at top */}
      <div className="aion-card-glow" aria-hidden="true" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80 font-rajdhani">{title}</p>
          <p className="text-4xl font-bold mt-1 font-orbitron">{value}</p>
          {subtitle && (
            <p className="text-xs opacity-70 mt-2 font-rajdhani">{subtitle}</p>
          )}
        </div>
        <div className="bg-white/20 rounded-full p-3">
          {icon}
        </div>
      </div>
    </div>
  );
}