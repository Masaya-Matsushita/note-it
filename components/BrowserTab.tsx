import Head from 'next/head'
import { FC } from 'react'

export const BrowserTab: FC = () => {
  return (
    <Head>
      <title>Note It</title>
      <meta
        name='viewport'
        content='minimum-scale=1, initial-scale=1, width=device-width'
      />
    </Head>
  )
}
