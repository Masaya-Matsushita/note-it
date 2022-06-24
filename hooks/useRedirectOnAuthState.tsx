import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { NextRouter } from 'next/router'

// 未ログインのときloginへ、ログイン済のときmy-pageへ
export const useRedirectOnAuthState = () => {
  const redirectOnAuthState = (router: NextRouter, redirect: boolean) => {
    onAuthStateChanged(auth, (user) => {
      // console.log('onAuthStateChanged is called!')
      if (user && redirect) {
        switch (router.pathname) {
          case '/login':
          case '/forgot-password':
          case '/auth-redirect': {
            // console.log('To Mypage')
            console.log('redirect in useRedirectOnAuthState:', redirect)
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
          case '/auth-redirect':
          case '/my-page/[uid]': {
            // console.log('To Login')
            console.log('redirect in useRedirectOnAuthState:', redirect)
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
