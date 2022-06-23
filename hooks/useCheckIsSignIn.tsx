import { NextRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'

type HookType = (router: NextRouter) => () => void

//　未ログインのときloginへ、ログイン済のときmy-pageへ
export const useCheckIsSignIn: HookType = (router) => {
  const checkIsSignIn = (): void => {
    onAuthStateChanged(auth, (user) => {
      // onAuthStateChangedが呼ばれたとき
      console.log('onAuthStateChanged is Called!')
      // ログインしている時
      if (user && router.pathname === '/login') {
        console.log('To Mypage')
        router.push(`/my-page/${user.uid}`)
      }
      if (user && router.pathname === '/forgot-password') {
        console.log('To Mypage')
        router.push(`/my-page/${user.uid}`)
      }
      if (user && router.pathname === '/auth-redirect') {
        console.log('To Mypage')
        router.push(`/my-page/${user.uid}`)
      }
      // ログインしていない時
      if (!user && router.pathname !== '/login') {
        if (router.pathname !== '/forgot-password') {
          console.log('To Login')
          router.push('/login')
        }
      }
    })
  }

  return checkIsSignIn
}
