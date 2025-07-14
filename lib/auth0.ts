import { Auth0Client } from '@auth0/nextjs-auth0/server'

// Check for required environment variables
const requiredEnvVars = ['AUTH0_SECRET', 'AUTH0_BASE_URL', 'AUTH0_ISSUER_BASE_URL', 'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET']
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingEnvVars.length > 0) {
  console.error('Missing required Auth0 environment variables:', missingEnvVars)
}

export const auth0 = new Auth0Client({
  signInReturnToPath: '/dashboard',
  baseURL: process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET
})