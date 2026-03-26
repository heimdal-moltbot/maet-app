import { MealPlanDaySkeleton } from '@/components/ui/Skeleton'

/**
 * Madplan loading fallback — Suspense boundary.
 */
export default function MadplanLoading() {
  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header skeleton */}
      <div className="px-4 pt-12 md:pt-20 pb-3 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-24 bg-bg-alt rounded animate-pulse" />
          <div className="h-3 w-36 bg-bg-alt rounded animate-pulse" />
        </div>
        <div className="h-9 w-24 bg-bg-alt rounded-md animate-pulse" />
      </div>

      {/* Uge-navigator skeleton */}
      <div className="px-4 mb-4">
        <div className="h-11 bg-bg-alt rounded-md animate-pulse" />
      </div>

      {/* Dage skeleton */}
      <div className="px-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <MealPlanDaySkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
