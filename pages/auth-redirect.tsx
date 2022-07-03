import { ErrorModal } from 'components/Modal/ErrorModal'
import { useEffect, useState } from 'react'
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

const AuthRedirectWithGoogle: NextPage = () => {
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [method, setMethod] = useState('')

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
        setPageLoading(false)
        setMethod('redirect')
        setError(error.code)
      })
  }

  useEffect(() => {
    // router起因のエラー対処 'No router instance found. you should only use "next/router" inside the client side of your app.'
    if (!router.isReady) {
      return
    }
    redirectToMypage()
  }, [router.isReady])

  return (
    <>
      <ErrorModal
        router={router}
        error={error}
        setError={setError}
        method={method}
        setMethod={setMethod}
      />
      <LoadingOverlay visible={pageLoading} loaderProps={{ size: 'xl' }} />
    </>
  )
}

export default AuthRedirectWithGoogle
