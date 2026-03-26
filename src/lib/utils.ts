/**
 * Utility: Merge Tailwind class names (simpel version uden clsx/twMerge).
 * Erstatter med clsx + tailwind-merge hvis kompleksitet vokser.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
