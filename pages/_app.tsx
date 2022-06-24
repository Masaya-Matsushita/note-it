import { Layout } from 'components/Layout'
import { useRedirectOnAuthState } from 'hooks/useRedirectOnAuthState'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import 'styles/globals.css'

export default function App(props: AppProps) {
  const { Component, pageProps } = props
  const router = useRouter()
  const [redirect, setRedirect] = useState(true)
  const redirectOnAuthState = useRedirectOnAuthState(router, redirect)

  useEffect(() => {
    if (redirect) {
      redirectOnAuthState()
    }
  }, [redirect])

  return (
    <>
      <Layout>
        <Component
          {...pageProps}
          redirect={redirect}
          setRedirect={setRedirect}
        />
      </Layout>
    </>
  )
}
