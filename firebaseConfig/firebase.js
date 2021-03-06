import { initializeApp } from 'firebase/app'
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth'
import { GoogleAuthProvider } from 'firebase/auth'
import { TwitterAuthProvider } from 'firebase/auth'
import { GithubAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebaseの構成
const firebaseConfig = {
  apiKey: 'AIzaSyC-OwOsGIEvuFnvLy7jz7mu5igRrMYksMI',
  authDomain: 'note-it-2b205.firebaseapp.com',
  projectId: 'note-it-2b205',
  storageBucket: 'note-it-2b205.appspot.com',
  messagingSenderId: '469727105908',
  appId: '1:469727105908:web:254a5d65c578c3c9885221',
  measurementId: 'G-3Y6QJQ684W',
}

// Firebaseを初期化
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
setPersistence(auth, browserSessionPersistence)
const googleProvider = new GoogleAuthProvider()
const twitterProvider = new TwitterAuthProvider()
const githubProvider = new GithubAuthProvider()
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, googleProvider, twitterProvider, githubProvider, storage }
export default db
