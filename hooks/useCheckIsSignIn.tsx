import { NextRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'

type HookType = (router: NextRouter) => () => void

export const useCheckIsSignIn: HookType = (router) => {
  //　未ログインのときloginへ、ログインのときmy-pageへ
  const checkIsSignIn = (): void => {
    onAuthStateChanged(auth, (user) => {
      // onAuthStateChangedが呼ばれたとき
      console.log('onAuthStateChanged is Called!')
      if (user && router.pathname === '/login') {
        // ログインしている時
        console.log('To Mypage')
        router.push(`/my-page/${user.uid}`)
      }
      if (!user && router.pathname !== '/login') {
        // ログインしていない時
        console.log('To Login')
        router.push('/login')
      }
    })
  }

  return checkIsSignIn
}
