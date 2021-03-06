import { Layout } from 'components/Layout'
import { Provider } from 'components/Layout/Provider'
import { useRedirectOnAuthState } from 'hooks/useRedirectOnAuthState'
import { useEffect } from 'react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import 'styles/globals.css'

export default function App(props: AppProps) {
  const { Component, pageProps } = props
  const router = useRouter()
  const redirectOnAuthState = useRedirectOnAuthState(router)

  // マウント時に一度だけ実行
  useEffect(() => {
    redirectOnAuthState()
  }, [])

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
