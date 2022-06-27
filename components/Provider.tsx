import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { FC, ReactNode } from 'react'

export const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
        }}
      >
        <NotificationsProvider>{children}</NotificationsProvider>
      </MantineProvider>
    </div>
  )
}
