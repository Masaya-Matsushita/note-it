import { NextRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { useCallback } from 'react'

export const useCheckIsSignIn = (router: NextRouter) => {
  const checkIsSignIn = useCallback(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && router.pathname === '/login') {
        router.push(`/my-page/${user.uid}`)
      }
      if (!user && router.pathname !== '/login') {
        if (router.pathname !== '/forgot-password') {
          router.push('/login')
        }
      }
    })
  }, [router])

  return checkIsSignIn
}
