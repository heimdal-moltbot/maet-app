/**
 * Dashboard loading fallback — Suspense boundary for hele dashboard-segmentet.
 * Vises mens server-komponenter fetcher data (f.eks. Supabase auth).
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Header skeleton */}
      <div className="px-4 pt-12 md:pt-20 pb-4 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-bg-alt rounded animate-pulse" />
          <div className="h-7 w-40 bg-bg-alt rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-full bg-bg-alt animate-pulse" />
          <div className="w-10 h-10 rounded-full bg-bg-alt animate-pulse" />
        </div>
      </div>

      {/* Hero card skeleton */}
      <div className="px-4 mb-6">
        <div className="h-3 w-28 bg-bg-alt rounded animate-pulse mb-3" />
        <div className="bg-bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="h-36 bg-bg-alt animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-6 w-48 bg-bg-alt rounded animate-pulse" />
            <div className="h-4 w-36 bg-bg-alt rounded animate-pulse" />
            <div className="h-11 bg-bg-alt rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      {/* Uge-strip skeleton */}
      <div className="mb-6">
        <div className="px-4 flex items-center justify-between mb-3">
          <div className="h-5 w-24 bg-bg-alt rounded animate-pulse" />
          <div className="h-4 w-16 bg-bg-alt rounded animate-pulse" />
        </div>
        <div className="flex gap-3 px-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex-shrink-0 w-[72px] h-[88px] rounded-md bg-bg-alt animate-pulse" />
          ))}
        </div>
      </div>

      {/* Quick actions skeleton */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <div className="h-28 rounded-xl bg-bg-alt animate-pulse" />
        <div className="h-28 rounded-xl bg-bg-alt animate-pulse" />
      </div>
    </div>
  )
}
