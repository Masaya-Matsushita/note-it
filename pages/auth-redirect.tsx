import { LoadingOverlay } from '@mantine/core'
import { getRedirectResult, signInWithRedirect } from 'firebase/auth'
import {
  auth,
  githubProvider,
  googleProvider,
  twitterProvider,
} from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const AuthRedirectWithGoogle: NextPage = () => {
  const router = useRouter()

  const redirectToMypage = (): void => {
    try {
      console.log(router)

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
          // queryの値で認証先プロバイダを判断
          if (router.query.provider === 'google') {
            console.log('google')
            signInWithRedirect(auth, googleProvider)
          } else if (router.query.provider === 'twitter') {
            console.log('twitter')
            signInWithRedirect(auth, twitterProvider)
          } else if (router.query.provider === 'github') {
            console.log('github')
            signInWithRedirect(auth, githubProvider)
          }
        }
      })
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
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
