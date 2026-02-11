import 'dotenv/config'
import admin from 'firebase-admin'
import { ExerciseSchema } from '@repo/shared'

// Initialize with your service account credentials
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
})

const db = admin.firestore()

const systemExercises = [
  { ownerId: 'system', name: 'Bench Press', category: 'strength', muscleGroup: 'chest' },
  { ownerId: 'system', name: 'Squat', category: 'strength', muscleGroup: 'legs' },
  { ownerId: 'system', name: 'Deadlift', category: 'strength', muscleGroup: 'back' },
  { ownerId: 'system', name: 'Pull-ups', category: 'strength', muscleGroup: 'back' },
  { ownerId: 'system', name: 'Push-ups', category: 'strength', muscleGroup: 'chest' },
  { ownerId: 'system', name: 'Running', category: 'strength', muscleGroup: 'cardio' },
  { ownerId: 'system', name: 'Plank', category: 'strength', muscleGroup: 'core' },
  { ownerId: 'system', name: 'Free Throws', category: 'skill', muscleGroup: 'skill' },
  { ownerId: 'system', name: 'Jump Shot', category: 'skill', muscleGroup: 'skill' },
  { ownerId: 'system', name: 'Swimming', category: 'strength', muscleGroup: 'cardio' },
]

async function seedExercises() {
  try {
    for (const exercise of systemExercises) {
      // Validate with Zod schema
      const validated = ExerciseSchema.parse(exercise)

      // Add to Firestore
      const docRef = await db.collection('exercises').add(validated)
      console.log(`✅ Added: ${exercise.name} (${docRef.id})`)
    }

    console.log('🎉 Seeding complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedExercises()
