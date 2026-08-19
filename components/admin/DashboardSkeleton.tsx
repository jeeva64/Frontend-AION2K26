'use client';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" id="statsContainer">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-aion-border rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-aion-border rounded animate-pulse"></div>
      </div>
      
      {/* Main Stats Grid skeleton - 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-aion-card border border-aion rounded-xl p-6 animate-pulse">
            <div className="h-4 w-32 bg-aion-border rounded mb-2"></div>
            <div className="h-12 w-24 bg-aion-border rounded"></div>
            <div className="h-3 w-16 bg-aion-border rounded mt-2"></div>
          </div>
        ))}
      </div>
      
      {/* Event-wise Stats skeleton */}
      <div className="bg-aion-card border border-aion rounded-xl p-6 animate-pulse">
        <div className="h-6 w-48 bg-aion-border rounded mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="p-4 bg-aion-border rounded-lg">
              <div className="h-4 w-32 bg-aion-border/50 rounded mb-2"></div>
              <div className="h-8 w-16 bg-aion-border/50 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* College Stats Table skeleton */}
      <div className="bg-aion-card border border-aion rounded-xl p-6 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-56 bg-aion-border rounded"></div>
          <div className="h-10 w-36 bg-aion-border rounded"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td className="px-4 py-3"><div className="h-4 w-8 bg-aion-border rounded"></div></td>
                  <td className="px-4 py-3"><div className="h-4 w-40 bg-aion-border rounded"></div></td>
                  <td className="px-4 py-3"><div className="h-4 w-20 bg-aion-border rounded"></div></td>
                  <td className="px-4 py-3"><div className="h-4 w-16 bg-aion-border rounded"></div></td>
                  <td className="px-4 py-3"><div className="h-4 w-12 bg-aion-border rounded"></div></td>
                  <td className="px-4 py-3"><div className="h-4 w-12 bg-aion-border rounded"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Degree + Dept Stats skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-aion-card border border-aion rounded-xl p-6 animate-pulse">
          <div className="h-6 w-56 bg-aion-border rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-16 bg-aion-border rounded"></div>
            <div className="h-16 bg-aion-border rounded"></div>
          </div>
        </div>
        <div className="bg-aion-card border border-aion rounded-xl p-6 animate-pulse">
          <div className="h-6 w-56 bg-aion-border rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="space-y-1">
                <div className="h-4 w-48 bg-aion-border rounded"></div>
                <div className="h-2 bg-aion-border rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="text-aion-error mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="font-orbitron text-xl font-bold text-aion-error mb-2">Failed to Load Stats</h3>
      <p className="text-aion-muted mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-aion-primary text-white text-sm rounded-lg font-medium hover:bg-aion-primary-hover transition flex items-center gap-2 mx-auto"
      >
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Retry
      </button>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-aion-muted mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="font-orbitron text-xl font-bold text-aion-muted mb-2">No Data Available</h3>
      <p className="text-aion-muted">No registration statistics found</p>
    </div>
  );
}