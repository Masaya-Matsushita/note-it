import { LoadingOverlay } from '@mantine/core'
import { getRedirectResult, signInWithRedirect } from 'firebase/auth'
import { auth, googleProvider } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const AuthRedirectWithGoogle: NextPage = () => {
  const router = useRouter()

  const redirectToMypage = (): void => {
    try {
      console.log('Start')
      getRedirectResult(auth).then((result) => {
        // getRedirectResultが呼ばれたとき
        console.log('Called!')
        if (result) {
          // resultに値がある時
          console.log('User.')
          const user = result.user
          router.push(`/my-page/${user.uid}`)
        } else {
          // resultがnullの時
          console.log('Null')
          // if (router.query.foo === 'foo') {
          // console.log('foo')
          signInWithRedirect(auth, googleProvider)
          // }
        }
      })
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message
        console.log(errorMessage)
        router.push('/login')
      }
    }
  }

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    redirectToMypage()
  }, [router.isReady])

  return <LoadingOverlay visible={true} loaderProps={{ size: 'xl' }} />
}

export default AuthRedirectWithGoogle
