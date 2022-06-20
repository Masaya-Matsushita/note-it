import { getRedirectResult, signInWithRedirect } from 'firebase/auth'
import {
  auth,
  githubProvider,
  googleProvider,
  twitterProvider,
} from 'firebaseConfig/firebase'
import { NextRouter } from 'next/router'
import { useCallback } from 'react'

type HookType = (router: NextRouter) => {
  googleSignIn: () => void
  twitterSignIn: () => void
  githubSignIn: () => void
  redirectToTop: () => Promise<void>
}

export const useAuthProvider: HookType = (router) => {
  const googleSignIn = () => {
    signInWithRedirect(auth, googleProvider)
  }

  const twitterSignIn = () => {
    signInWithRedirect(auth, twitterProvider)
  }

  const githubSignIn = () => {
    signInWithRedirect(auth, githubProvider)
  }

  const redirectToTop = useCallback(async () => {
    try {
      const result = await getRedirectResult(auth)
      if (result) {
        const user = result.user
        router.push(`/my-page/${user.uid}`)
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message
        console.log(errorMessage)
      }
    }
  }, [router])

  return { googleSignIn, twitterSignIn, githubSignIn, redirectToTop }
}
