import Head from 'next/head'

export const BrowserTab = (): JSX.Element => {
  return (
    // ブラウザのタブ設定
    <Head>
      <title>Note It</title>
      <meta
        name='viewport'
        content='minimum-scale=1, initial-scale=1, width=device-width'
      />
    </Head>
  )
}
