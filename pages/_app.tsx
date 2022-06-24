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
  const redirectOnAuthState = useRedirectOnAuthState()

  useEffect(() => {
    console.log('redirect in _app.tsx/useEffect:', redirect)
    if (redirect) {
      console.log('redirect in _app.tsx/useEffect/if:', redirect)
      redirectOnAuthState(router, redirect)
    } else {
      console.log('redirect in _app.tsx/useEffect/else:', redirect)
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
