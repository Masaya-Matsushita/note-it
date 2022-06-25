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
  console.log('_app.tsx:', redirect) // 追加した1行
  const redirectOnAuthState = useRedirectOnAuthState()

  useEffect(() => {
    console.log('_app.tsx/useEffect:', redirect)
    if (redirect) {
      redirectOnAuthState(router, redirect)
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
