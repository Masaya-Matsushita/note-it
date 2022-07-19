import { NextRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'

// 未ログインのときloginへ、ログイン済のときmy-pageへ
export const useRedirectOnAuthState = (router: NextRouter) => {
  const redirectOnAuthState = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        switch (router.pathname) {
          case '/login':
          case '/forgot-password':
          case '/auth-redirect': {
            const uid = user.uid
            router.push(`/my-page/${uid}`)
            break
          }
          default: {
            break
          }
        }
      } else {
        switch (router.pathname) {
          case '/no-verified':
          case '/my-page/[uid]': {
            router.push('/login')
            break
          }
          default: {
            break
          }
        }
      }
    })
  }

  return redirectOnAuthState
}
