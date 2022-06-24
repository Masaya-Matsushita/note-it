import { Layout } from 'components/Layout'
import { useCheckIsSignIn } from 'hooks/useCheckIsSignIn'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import 'styles/globals.css'

export default function App(props: AppProps) {
  const { Component, pageProps } = props
  const router = useRouter()
  const checkIsSignIn = useCheckIsSignIn(router)

  useEffect(() => {
    console.log('useEffect is called')
    checkIsSignIn()
  }, [])

  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
