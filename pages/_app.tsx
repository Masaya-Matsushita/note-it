import { Layout } from 'components/Layout'
import { useRedirectOnAuthState } from 'hooks/useRedirectOnAuthState'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import 'styles/globals.css'

export default function App(props: AppProps) {
  const { Component, pageProps } = props
  const router = useRouter()
  const redirectOnAuthState = useRedirectOnAuthState(router)

  useEffect(() => {
    redirectOnAuthState()
  }, [])

  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
