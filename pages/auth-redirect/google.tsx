import { LoadingOverlay } from '@mantine/core'
import {
  getRedirectResult,
  signInWithRedirect,
  UserCredential,
} from 'firebase/auth'
import { auth, googleProvider } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

const AuthRedirectWithGoogle: NextPage = () => {
  const router = useRouter()

  const redirectToMypage = useCallback(async (): Promise<void> => {
    try {
      const result: UserCredential | null = await getRedirectResult(auth)
      if (result) {
        const user = result.user
        router.push(`/my-page/${user.uid}`)
      } else {
        signInWithRedirect(auth, googleProvider)
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message
        console.log(errorMessage)
        router.push('/login')
      }
    }
  }, [router])

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    redirectToMypage()
  }, [router.isReady, redirectToMypage])

  return <LoadingOverlay visible={true} loaderProps={{ size: 'xl' }} />
}

export default AuthRedirectWithGoogle
