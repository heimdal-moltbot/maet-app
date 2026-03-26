import { BottomNav } from '@/components/navigation/BottomNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bg">
      <main className="max-w-md mx-auto pb-16 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  )
}
