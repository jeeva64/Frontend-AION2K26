'use client';

import { useDashboardStats } from '@/hooks/useDashboardStats';
import { aionAlert } from '@/lib/alerts';
import { exportCollegeStats } from '@/lib/export';
import { getAdminToken } from '@/lib/auth';
import { StatCard } from './StatCard';
import { EventStatCard } from './EventStatCard';
import { CollegeStatsTable } from './CollegeStatsTable';
import { DegreeStats } from './DegreeStats';
import { DeptStats } from './DeptStats';
import { DashboardSkeleton, ErrorState, EmptyState } from './DashboardSkeleton';
import { EVENT_SLOT_MAP } from '@/lib/constants/admin';

export function DashboardPanel() {
  const { data: stats, isLoading, error, refetch } = useDashboardStats();

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;
  if (!stats) return <EmptyState />;

  const handleExportCollegeStats = () => {
    if (!stats.collegeStats.length) {
      aionAlert.warning('No Data', 'No college stats to export');
      return;
    }
    exportCollegeStats(stats.collegeStats);
    aionAlert.success('Success', 'College stats exported!');
  };

  return (
    <div className="space-y-6" id="statsContainer">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-orbitron text-2xl font-bold text-aion-primary">Registration Statistics</h2>
          <p className="text-aion-muted text-sm mt-1">Overview of all registrations for AION 2K26</p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-aion-primary text-white text-sm rounded-lg font-medium hover:bg-aion-primary-hover transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Stats
        </button>
      </div>

      {/* Main Stats Grid - 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Teams"
          value={stats.totalTeams}
          subtitle="Unique College + Dept + Shift"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          gradient="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Vegetarian"
          value={stats.vegCount}
          subtitle={`${stats.totalMembers > 0 ? ((stats.vegCount / stats.totalMembers) * 100).toFixed(1) : 0}% of total`}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          }
          gradient="from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Non-Vegetarian"
          value={stats.nonVegCount}
          subtitle={`${stats.totalMembers > 0 ? ((stats.nonVegCount / stats.totalMembers) * 100).toFixed(1) : 0}% of total`}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          gradient="from-amber-500 to-amber-600"
        />
      </div>

      {/* Event-wise Stats */}
      <div className="bg-aion-card rounded-xl border border-aion p-6">
        <h3 className="font-orbitron text-lg font-semibold text-aion-primary mb-4">📅 Event-wise Registrations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="eventStatsContainer">
          {Object.entries(stats.eventCounts).map(([event, count]) => (
            <EventStatCard key={event} event={event as keyof typeof EVENT_SLOT_MAP} count={count} />
          ))}
        </div>
      </div>

      {/* College Stats Table + Export */}
      <div className="bg-aion-card rounded-xl border border-aion p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-orbitron text-lg font-semibold text-aion-primary">🏫 College-wise Registrations</h3>
          <button
            onClick={handleExportCollegeStats}
            className="px-4 py-2 bg-aion-success text-white text-sm rounded-lg font-medium hover:bg-aion-success-hover transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export to Excel
          </button>
        </div>
        <CollegeStatsTable data={stats.collegeStats} />
      </div>

      {/* Degree + Dept Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DegreeStats ugCount={stats.ugCount} pgCount={stats.pgCount} />
        <DeptStats deptCounts={stats.deptCounts} totalMembers={stats.totalMembers} />
      </div>
    </div>
  );
}