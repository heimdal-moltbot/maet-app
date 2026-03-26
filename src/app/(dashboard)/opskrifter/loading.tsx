/**
 * Opskrifter loading fallback — Suspense boundary for opskrift-listen.
 */
export default function OpskrifterLoading() {
  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Header skeleton */}
      <div className="px-4 pt-12 md:pt-20 pb-3">
        <div className="h-7 w-32 bg-bg-alt rounded animate-pulse mb-1" />
        <div className="h-4 w-48 bg-bg-alt rounded animate-pulse" />
      </div>

      {/* Søgefelt skeleton */}
      <div className="px-4 mb-3">
        <div className="h-11 bg-bg-alt rounded-xl animate-pulse" />
      </div>

      {/* Filter pills skeleton */}
      <div className="flex gap-2 px-4 mb-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex-shrink-0 h-10 w-20 rounded-full bg-bg-alt animate-pulse" />
        ))}
      </div>

      {/* 2-kolonne grid skeleton */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-bg-surface rounded-xl overflow-hidden border border-border">
            <div className="bg-bg-alt animate-pulse" style={{ paddingBottom: '75%' }} />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-bg-alt rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-bg-alt rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
