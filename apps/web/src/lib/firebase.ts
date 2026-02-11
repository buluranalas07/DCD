import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDIKFWTXfmtGrS9VWzMrZNm6fzbeJfeB-0',
  authDomain: 'dcd-lab.firebaseapp.com',
  projectId: 'dcd-lab',
  storageBucket: 'dcd-lab.firebasestorage.app',
  messagingSenderId: '221594456574',
  appId: '1:221594456574:web:51e6770f844688aa3ef0af',
  measurementId: 'G-P99Y5BEDMQ',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Analytics only in browser environment
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

// Initialize Auth and Firestore
const auth = getAuth(app)
const db = getFirestore(app)

export { app, analytics, auth, db }
