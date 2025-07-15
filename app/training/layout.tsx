import DashboardShell from '@/components/DashboardShell'

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell>{children}</DashboardShell>
}