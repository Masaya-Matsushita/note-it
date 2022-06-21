import { Button } from '@mantine/core'
import { signOut } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'

const Mypage: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const signout = async (): Promise<void> => {
    setLoading(true)
    await signOut(auth)
    setLoading(false)
    router.push('/login')
  }

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
