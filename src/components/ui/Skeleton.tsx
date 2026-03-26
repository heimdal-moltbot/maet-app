import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  'aria-label'?: string
}

/**
 * Skeleton loader — bruges til at indikere loading-tilstand.
 * Bruger Tailwind animate-pulse og design system tokens.
 */
export function Skeleton({ className, 'aria-label': ariaLabel }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label={ariaLabel ?? 'Indlæser...'}
      aria-busy="true"
      className={cn('animate-pulse rounded-md bg-bg-alt', className)}
    />
  )
}

/** Skeleton til opskrift-kort (2-kolonne grid) */
export function RecipeCardSkeleton() {
  return (
    <div aria-hidden="true" className="block bg-bg-surface rounded-xl overflow-hidden border border-border shadow-sm">
      {/* Billede 4:3 */}
      <div className="relative" style={{ paddingBottom: '75%' }}>
        <div className="absolute inset-0 animate-pulse bg-bg-alt" />
      </div>
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

/** Skeleton til indkøbsliste-kategori */
export function ShoppingCategorySkeleton() {
  return (
    <div aria-hidden="true" className="space-y-3">
      <Skeleton className="h-4 w-24" />
      <div className="bg-bg-surface rounded-lg border border-border shadow-sm overflow-hidden divide-y divide-border">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 px-4 h-[52px]">
            <Skeleton className="w-6 h-6 rounded-sm flex-shrink-0" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-12 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Skeleton til madplan-dag */
export function MealPlanDaySkeleton() {
  return (
    <div aria-hidden="true" className="space-y-1.5">
      <Skeleton className="h-4 w-32" />
      <div className="bg-bg-surface rounded-lg border border-border shadow-sm overflow-hidden divide-y divide-border">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 px-4 h-14">
            <Skeleton className="w-7 h-7 rounded-md flex-shrink-0" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>
  )
}
