import { ShoppingCategorySkeleton } from '@/components/ui/Skeleton'

/**
 * Indkøbsliste loading fallback — Suspense boundary.
 */
export default function IndkoebslisteLoading() {
  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Header skeleton */}
      <div className="px-4 pt-12 md:pt-20 pb-3 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-36 bg-bg-alt rounded animate-pulse" />
          <div className="h-3 w-24 bg-bg-alt rounded animate-pulse" />
        </div>
        <div className="w-9 h-9 rounded-full bg-bg-alt animate-pulse" />
      </div>

      {/* Progress skeleton */}
      <div className="px-4 mb-3">
        <div className="flex justify-between mb-1.5">
          <div className="h-3 w-28 bg-bg-alt rounded animate-pulse" />
          <div className="h-3 w-8 bg-bg-alt rounded animate-pulse" />
        </div>
        <div className="h-2 bg-bg-alt rounded-full animate-pulse" />
      </div>

      {/* Filter pills skeleton */}
      <div className="flex gap-2 px-4 mb-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex-shrink-0 h-8 w-20 rounded-full bg-bg-alt animate-pulse" />
        ))}
      </div>

      {/* Kategorier skeleton */}
      <div className="px-4 space-y-4">
        <ShoppingCategorySkeleton />
        <ShoppingCategorySkeleton />
        <ShoppingCategorySkeleton />
      </div>
    </div>
  )
}
