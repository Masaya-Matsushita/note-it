import { getRedirectResult, signInWithRedirect } from 'firebase/auth'
import {
  auth,
  githubProvider,
  googleProvider,
  twitterProvider,
} from 'firebaseConfig/firebase'
import { NextRouter } from 'next/router'

export const useAuthProvider = (router: NextRouter) => {
  const googleSignIn = () => {
    signInWithRedirect(auth, googleProvider)
  }

  const twitterSignIn = () => {
    signInWithRedirect(auth, twitterProvider)
  }

  const githubSignIn = () => {
    signInWithRedirect(auth, githubProvider)
  }

  const redirectToTop = async () => {
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
  }

  return { googleSignIn, twitterSignIn, githubSignIn, redirectToTop }
}
