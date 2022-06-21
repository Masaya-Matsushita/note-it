import { NextRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { useCallback } from 'react'

type HookType = (router: NextRouter) => () => void

export const useCheckIsSignIn: HookType = (router) => {
  const checkIsSignIn = useCallback((): void => {
    onAuthStateChanged(auth, (user) => {
      if (user && router.pathname === '/login') {
        router.push(`/my-page/${user.uid}`)
      }
      if (!user && router.pathname !== '/login') {
        if (router.pathname !== '/auth-redirect') {
          if (router.pathname !== '/forgot-password') {
            router.push('/login')
          }
        }
      }
    })
  }, [router])

  return checkIsSignIn
}
