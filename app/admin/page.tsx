'use client'

import { Card } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { 
  UserGroupIcon, 
  DocumentDuplicateIcon,
  ChartBarIcon,
  CogIcon 
} from '@heroicons/react/24/outline'

export default function AdminPage() {
  return (
    <>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-secondary-900">Admin Panel</h1>
        <p className="mt-2 text-secondary-600">
          Manage users, monitor system activity, and configure platform settings.
        </p>
      </motion.div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-4">
        {[
          { name: 'Total Users', value: '47', icon: UserGroupIcon, color: 'text-primary-600' },
          { name: 'Active Licenses', value: '10', icon: DocumentDuplicateIcon, color: 'text-green-600' },
          { name: 'Documents Created', value: '283', icon: ChartBarIcon, color: 'text-amber-600' },
          { name: 'System Health', value: '99.9%', icon: CogIcon, color: 'text-indigo-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-secondary-50`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-secondary-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">User Management</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium">View All Users</span>
                <span className="text-sm text-secondary-500">47 users</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium">Manage Licenses</span>
                <span className="text-sm text-secondary-500">10 active</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium">Invite New User</span>
                <span className="text-sm text-secondary-500">→</span>
              </div>
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Recent Admin Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'New user registered', user: 'jane.smith@lawfirm.com', time: '2 hours ago' },
              { action: 'License renewed', user: 'Founding Member #3', time: '5 hours ago' },
              { action: 'Template updated', user: 'System', time: 'Yesterday' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-secondary-900">{activity.action}</p>
                  <p className="text-sm text-secondary-600">{activity.user}</p>
                </div>
                <span className="text-sm text-secondary-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}