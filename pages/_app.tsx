import { Layout } from 'components/Layout'
import { Provider } from 'components/Layout/Provider'
import { useEffect } from 'react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import 'styles/globals.css'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'

export default function App(props: AppProps) {
  const { Component, pageProps } = props
  const router = useRouter()

  // マウント時に一度だけ実行
  useEffect(() => {
    redirectOnAuthState()
  }, [])

  // 未ログインのときloginへ、ログイン済のときmy-pageへ
  const redirectOnAuthState = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        switch (router.pathname) {
          case '/login':
          case '/forgot-password':
          case '/auth-redirect': {
            router.push(`/my-page/${user.uid}`)
            break
          }
          default: {
            break
          }
        }
      } else {
        switch (router.pathname) {
          case '/no-verified':
          case '/my-page/[uid]':
          case '/my-page/[uid]/book-form':
          case '/my-page/[uid]/[bookId]':
          case '/my-page/[uid]/[bookId]/note-form':
          case '/my-page/[uid]/[bookId]/[noteId]': {
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

  return (
    <>
      <Provider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  )
}
