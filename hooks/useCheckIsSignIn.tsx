import { NextRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'

type HookType = (router: NextRouter) => () => void

//　未ログインのときloginへ、ログイン済のときmy-pageへ
export const useCheckIsSignIn: HookType = (router) => {
  const checkIsSignIn = (): void => {
    onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChanged is Called!')
      if (user) {
        switch (router.pathname) {
          case '/login':
          case '/forgot-password':
          case '/auth-redirect': {
            console.log('To Mypage')
            router.push(`/my-page/${user.uid}`)
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
            console.log('To Login')
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

  return checkIsSignIn
}
