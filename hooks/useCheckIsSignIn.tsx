import { NextRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'

export const useCheckIsSignIn = (router: NextRouter) => {
  const checkIsSignIn = () => {
    onAuthStateChanged(auth, (user) => {
      if (user && router.pathname === '/login') {
        router.push('/')
      }
      if (!user && router.pathname !== '/login') {
        if (router.pathname !== '/forgot-password') {
          router.push('/login')
        }
      }
    })
  }
  return checkIsSignIn
}
