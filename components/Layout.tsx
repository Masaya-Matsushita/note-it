import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
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
          colorScheme: 'dark',
        }}
      >
        <NotificationsProvider>
          <div className='p-4 mx-auto max-w-4xl'>{children}</div>
        </NotificationsProvider>
      </MantineProvider>
    </div>
  )
}
