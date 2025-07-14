'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function LoginClient() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-card rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">KEEP Protocol</h1>
            <p className="text-muted-foreground">Bitcoin Estate Planning Dashboard</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground text-center">Welcome Back</h2>
            <p className="text-muted-foreground text-center">
              Sign in to access your KEEP licensing dashboard
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Button asChild className="w-full" size="lg">
              <a href="/auth/login">
                Sign In with Auth0
              </a>
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Don't have an account?</p>
              <a href="/auth/login?screen_hint=signup" className="text-primary hover:underline font-medium">
                Sign up for an account
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Secure authentication powered by Auth0
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}