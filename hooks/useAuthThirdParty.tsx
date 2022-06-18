import { getRedirectResult, signInWithRedirect } from 'firebase/auth'
import { auth, facebookProvider, googleProvider } from 'firebaseConfig/firebase'
import { NextRouter } from 'next/router'
import { useCallback } from 'react'

export const useAuthThirdParty = (router: NextRouter) => {
  const googleSignIn = () => {
    signInWithRedirect(auth, googleProvider)
  }

  const facebookSignIn = () => {
    signInWithRedirect(auth, facebookProvider)
  }

  const redirectToTop = useCallback(async () => {
    try {
      const result = await getRedirectResult(auth)
      if (result) {
        router.push('/')
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message
        console.log(errorMessage)
      }
    }
  }, [router])

  return { googleSignIn, facebookSignIn, redirectToTop }
}
