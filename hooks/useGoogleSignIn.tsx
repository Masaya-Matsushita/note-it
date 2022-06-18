import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, provider } from 'firebaseConfig/firebase'
import { NextRouter } from 'next/router'

export const useGoogleSignIn = (router: NextRouter) => {
  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential?.accessToken
      const user = result.user
      console.log(token, user)

      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message
        console.log(errorMessage)
      }
    }
  }
  return googleSignIn
}
