import { MantineProvider } from '@mantine/core'
import Head from 'next/head'
import { FC, ReactNode } from 'react'

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Page title</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'light',
        }}
      >
        <div className='mx-auto max-w-4xl'>{children}</div>
      </MantineProvider>
    </div>
  )
}
