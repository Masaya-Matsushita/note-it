import { MantineProvider } from '@mantine/core'
import { FC, ReactNode } from 'react'
import { BrowserTab } from './BrowserTab'

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <BrowserTab />
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
