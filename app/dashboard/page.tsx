'use client'

import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  return (
    <>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
        <p className="mt-2 text-secondary-600">
          Welcome to your KEEP Licensing Dashboard. Monitor your Bitcoin estate planning practice.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
        <StatCard
          title="Active Clients"
          value="12"
          color="primary"
          delay={0.1}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />

        <StatCard
          title="In Progress"
          value="8"
          color="amber"
          delay={0.2}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />

        <StatCard
          title="Completed This Month"
          value="4"
          color="green"
          delay={0.3}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { client: 'Smith Family Trust', action: 'Phase 3: Legal Drafting completed', time: '2 hours ago' },
            { client: 'Johnson Estate', action: 'New client intake started', time: '5 hours ago' },
            { client: 'Williams Trust', action: 'Compliance check scheduled', time: 'Yesterday' },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-0"
            >
              <div>
                <p className="font-medium text-secondary-900">{activity.client}</p>
                <p className="text-sm text-secondary-600">{activity.action}</p>
              </div>
              <span className="text-sm text-secondary-500">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </>
  )
}