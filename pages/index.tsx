import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button } from '@mantine/core'

const Top: NextPage = () => {
  const router = useRouter()

  return (
    <>
      <h1>Note It</h1>
      <Button onClick={() => router.push('/login')}>To Login</Button>
    </>
  )
}

export default Top
