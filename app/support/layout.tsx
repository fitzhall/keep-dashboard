import DashboardShell from '@/components/DashboardShell'

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell>{children}</DashboardShell>
}