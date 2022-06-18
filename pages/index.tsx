import { Button } from '@mantine/core'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const router = useRouter()

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

  const signout = async () => {
    await signOut(auth)
    router.push('/signin')
  }

  return <Button onClick={signout}>サインアウト</Button>
}

export default Home
