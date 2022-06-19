// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
// import { getFirestore } from 'firebase/firestore'
import { GoogleAuthProvider } from 'firebase/auth'
import { TwitterAuthProvider } from 'firebase/auth'
import { GithubAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC-OwOsGIEvuFnvLy7jz7mu5igRrMYksMI',
  authDomain: 'note-it-2b205.firebaseapp.com',
  projectId: 'note-it-2b205',
  storageBucket: 'note-it-2b205.appspot.com',
  messagingSenderId: '469727105908',
  appId: '1:469727105908:web:254a5d65c578c3c9885221',
  measurementId: 'G-3Y6QJQ684W',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
const auth = getAuth(app)
// const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()
const twitterProvider = new TwitterAuthProvider()
const githubProvider = new GithubAuthProvider()

export { auth, googleProvider, twitterProvider, githubProvider }
// export default db
