import 'dotenv/config'
import admin from 'firebase-admin'
import { TRPCError } from '@trpc/server'

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

export const db = admin.firestore()

// Context type
export interface Context {
  uid: string | null
  db: FirebaseFirestore.Firestore
}

// Create context from request headers
export async function createContext(opts: {
  req?: { headers?: Record<string, string | string[] | undefined> }
}): Promise<Context> {
  const authHeader = opts.req?.headers?.authorization

  // No token = null uid (for public routes)
  if (!authHeader || typeof authHeader !== 'string') {
    return { uid: null, db }
  }

  try {
    // Extract token from "Bearer <token>"
    const token = authHeader.split('Bearer ')[1]

    if (!token) {
      return { uid: null, db }
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token)

    return {
      uid: decodedToken.uid,
      db,
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid authentication token',
    })
  }
}
