import { ErrorModal } from 'components/Modal/ErrorModal'
import { useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { getRedirectResult, signInWithRedirect } from 'firebase/auth'
import {
  auth,
  githubProvider,
  googleProvider,
  twitterProvider,
} from 'firebaseConfig/firebase'
import { LoadingOverlay } from '@mantine/core'
import { useAuthRedirectState } from 'hooks/StateManagement/useAuthRedirectState'

const AuthRedirectWithGoogle: NextPage = () => {
  const router = useRouter()
  const { state, dispatch } = useAuthRedirectState()

  // 各プロバイダへリダイレクト認証
  const redirectToMypage = (): void => {
    getRedirectResult(auth)
      .then((result) => {
        // ユーザーが未認証の時
        if (result === null) {
          // queryの値で認証先プロバイダを判断
          if (router.query.provider === 'google') {
            signInWithRedirect(auth, googleProvider)
          } else if (router.query.provider === 'twitter') {
            signInWithRedirect(auth, twitterProvider)
          } else if (router.query.provider === 'github') {
            signInWithRedirect(auth, githubProvider)
          }
        }
      })
      .catch((error: any) => {
        // pageLoadingを非表示に、ErrorModalを表示
        dispatch({ type: 'error', error: error.code, method: 'redirect' })
      })
  }

  useEffect(() => {
    // router起因のエラー対処
    // 'No router instance found. you should only use "next/router" inside the client side of your app.'
    if (!router.isReady) {
      return
    }
    redirectToMypage()
  }, [router.isReady])

  return (
    <>
      <ErrorModal
        router={router}
        error={state.error}
        method={state.method}
        dispatch={dispatch}
      />
      <LoadingOverlay
        visible={state.pageLoading}
        loaderProps={{ size: 'xl' }}
      />
    </>
  )
}

export default AuthRedirectWithGoogle
