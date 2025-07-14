'use client'

import { motion } from 'framer-motion'

export default function LoginClient() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">KEEP Protocol</h1>
            <p className="text-secondary-600">Bitcoin Estate Planning Dashboard</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-secondary-900 text-center">Welcome Back</h2>
            <p className="text-secondary-600 text-center">
              Sign in to access your KEEP licensing dashboard
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <a
              href="/auth/login"
              className="block w-full text-center bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              Sign In with Auth0
            </a>
            
            <div className="text-center text-sm text-secondary-600">
              <p>Don't have an account?</p>
              <a href="/auth/login?screen_hint=signup" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up for an account
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-secondary-200">
            <p className="text-xs text-secondary-500 text-center">
              Secure authentication powered by Auth0
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}