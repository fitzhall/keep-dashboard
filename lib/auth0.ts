// import { Auth0Client } from '@auth0/nextjs-auth0/server' // TODO: Fix Auth0 server import

// Mock Auth0 client until properly configured
import { NextResponse } from 'next/server'

export const auth0 = {
  getSession: async () => {
    try {
      // Return mock session for development
      return {
        user: {
          sub: 'auth0|mock-user-id',
          email: 'user@example.com',
          name: 'Test User',
          picture: undefined,
          nickname: 'testuser'
        }
      }
    } catch (error) {
      console.error('Error in getSession:', error)
      return null
    }
  },
  getAccessToken: async () => {
    return { accessToken: 'mock-access-token' }
  },
  middleware: async (request: any) => {
    // Mock middleware - just pass through all requests
    return NextResponse.next()
  }
}