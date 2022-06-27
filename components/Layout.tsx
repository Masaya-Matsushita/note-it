import { FC, ReactNode } from 'react'
import { BrowserTab } from './BrowserTab'

type Props = { children: ReactNode }

export const Layout: FC<Props> = ({ children }) => {
  return (
    // アプリ全体に適用するレイアウト
    <div>
      <BrowserTab />
      <div className='p-4 mx-auto max-w-4xl'>{children}</div>
    </div>
  )
}
