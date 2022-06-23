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
  const [visible, setVisible] = useState(true)
  const [error, setError] = useState('')
  const [method, setMethod] = useState('')

  const redirectToMypage = (): void => {
    try {
      console.log(router)
      // throw new Error('aaa');

      console.log('Start')
      getRedirectResult(auth).then((result) => {
        // getRedirectResultが呼ばれたとき
        console.log('Called!')
        if (result) {
          // resultに値がある時
          console.log('User.')
          const user = result.user
          router.push(`/my-page/${user.uid}`)
        } else {
          // resultがnullの時
          console.log('Null')
          // queryの値で認証先プロバイダを判断
          if (router.query.provider === 'google') {
            console.log('google')
            signInWithRedirect(auth, googleProvider)
          } else if (router.query.provider === 'twitter') {
            console.log('twitter')
            signInWithRedirect(auth, twitterProvider)
          } else if (router.query.provider === 'github') {
            console.log('github')
            signInWithRedirect(auth, githubProvider)
          }
        }
      })
    } catch (error: any) {
      // console.log(error.code)
      setVisible(false)
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
    <div>
      <ErrorModal
        error={error}
        setError={setError}
        method={method}
        setMethod={setMethod}
      />
      <LoadingOverlay visible={visible} loaderProps={{ size: 'xl' }} />
    </div>
  )
}

export default AuthRedirectWithGoogle
