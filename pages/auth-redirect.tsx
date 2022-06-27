import { LoadingOverlay } from '@mantine/core'
import { ErrorModal } from 'components/ErrorModal'
import { getRedirectResult, signInWithRedirect } from 'firebase/auth'
import {
  auth,
  githubProvider,
  googleProvider,
  twitterProvider,
} from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const AuthRedirectWithGoogle: NextPage = () => {
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [method, setMethod] = useState('')

  const redirectToMypage = (): void => {
    try {
      console.log(router)

      getRedirectResult(auth).then((result) => {
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
    } catch (error: any) {
      setPageLoading(false)
      setMethod('redirect')
      setError(error.code)
    }
  }

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    redirectToMypage()
  }, [router.isReady])

  return (
    <>
      <ErrorModal
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
