import { LoadingOverlay } from '@mantine/core'
import { ErrorModal } from 'components/ErrorModal'
import {
  fetchSignInMethodsForEmail,
  getAuth,
  getRedirectResult,
  GithubAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from 'firebase/auth'
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
        console.log(error.code)
        // // pendingCredとemailがundefinedになる
        // if (error.code === 'auth/account-exists-with-different-credential') {
        //   const pendingCred = error.credential // undefined
        //   const email = error.email // undefined
        //   fetchSignInMethodsForEmail(auth, email) // auth/missing-identifier
        //     .then((methods) => {
        //       console.log(methods)
        //       if (methods[0] === 'password') {
        //         const password = prompt('パスワードを入力してください。')
        //         if (password) {
        //           console.log(password)
        //           signInWithEmailAndPassword(auth, email, password)
        //             .then((result) => {
        //               return linkWithCredential(result.user, pendingCred)
        //             })
        //             .then((usercred) => {
        //               console.log(usercred)
        //               console.log('success!')
        //             })
        //             .catch((error) => {
        //               console.log(error.code)
        //             })
        //         }
        //       }
        //     })
        //     .catch((error) => {
        //       console.log(error.code)
        //     })
        //   return
        //   // このアカウントは既に別の方法でログインされています。
        // }

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
