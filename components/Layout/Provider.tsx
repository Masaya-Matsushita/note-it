import { FC, ReactNode } from 'react'
import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'

type Props = { children: ReactNode }

export const Provider: FC<Props> = ({ children }) => {
  return (
    // アプリ全体に適用するproviderの設定
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
