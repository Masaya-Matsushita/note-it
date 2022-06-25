import { Button } from '@mantine/core'
import { signOut } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Mypage: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const signout = async (): Promise<void> => {
    setLoading(true)
    await signOut(auth)
    setLoading(false)
    router.push('/login')
  }

  useEffect(() => {
    if (auth.currentUser) {
      console.log(auth.currentUser.emailVerified)
      console.log(auth.currentUser.providerData[0].providerId)
    }
  }, [])

  return (
    <div>
      <div>{router.query.uid}</div>
      <Button onClick={signout} loading={loading}>
        サインアウト
      </Button>
    </div>
  )
}

export default Mypage
