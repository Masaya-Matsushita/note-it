import { Button } from '@mantine/core'
import { signOut } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()

  const signout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  return (
    <div>
      <div>{router.query.uid}</div>
      <Button onClick={signout}>サインアウト</Button>
    </div>
  )
}

export default Home
