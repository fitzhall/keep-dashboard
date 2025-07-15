import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''

// Only create client if we have the required environment variables
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not found. Database features will be disabled.')
    // Return a mock client that won't throw errors
    const mockResult = {
      data: null as any,
      error: null,
      count: null,
      status: 200,
      statusText: 'OK'
    }
    
    const chainableMethods = {
      select: () => chainableMethods,
      insert: () => chainableMethods,
      update: () => chainableMethods,
      upsert: () => chainableMethods,
      delete: () => chainableMethods,
      eq: () => chainableMethods,
      neq: () => chainableMethods,
      gt: () => chainableMethods,
      gte: () => chainableMethods,
      lt: () => chainableMethods,
      lte: () => chainableMethods,
      like: () => chainableMethods,
      ilike: () => chainableMethods,
      is: () => chainableMethods,
      in: () => chainableMethods,
      order: () => chainableMethods,
      limit: () => chainableMethods,
      single: () => Promise.resolve({ ...mockResult, data: null }),
      maybeSingle: () => Promise.resolve({ ...mockResult, data: null }),
      then: (resolve: any) => resolve({ ...mockResult, data: [] })
    }
    
    return {
      from: () => chainableMethods,
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null })
      },
      rpc: () => chainableMethods
    } as any
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

export const supabase = createSupabaseClient()

// Admin client for server-side operations
export const getServiceSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  if (!serviceKey || !supabaseUrl) {
    console.warn('Supabase service role key or URL not found. Admin features will be disabled.')
    // Return the same mock client
    return supabase
  }
  
  return createClient<Database>(
    supabaseUrl,
    serviceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}