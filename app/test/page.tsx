'use client'

import { Card } from '@/components/ui/Card'
import { motion } from 'framer-motion'

export default function TestPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Component Test Page</h1>
      
      <div className="space-y-8">
        {/* Test Framer Motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-500 text-white p-4 rounded-lg"
        >
          <h2 className="text-xl font-bold">Framer Motion Test</h2>
          <p>This should fade in and scale up when you load the page</p>
        </motion.div>

        {/* Test Card Component */}
        <Card>
          <h2 className="text-xl font-bold mb-2">Card Component Test</h2>
          <p>This uses our custom Card component with animations</p>
        </Card>

        {/* Test Hover Animation */}
        <motion.button
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Hover Me! (Should scale up)
        </motion.button>
      </div>
    </div>
  )
}