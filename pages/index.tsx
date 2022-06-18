import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import type { NextPage } from 'next'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const checkAuthState = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid
        console.log(uid)
      } else {
        console.log('User is signed out!')
      }
    })
  }

  useEffect(() => {
    checkAuthState()
  }, [])

  return <div>hello</div>
}

export default Home
