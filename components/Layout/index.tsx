import { BrowserTab } from './BrowserTab'
import { Footer } from './Footer'
import { Header } from './Header'
import { FC, ReactNode } from 'react'

type Props = { children: ReactNode }

export const Layout: FC<Props> = ({ children }) => {
  return (
    <div>
      <BrowserTab />
      <Header />
      {/* ボディ全体に適用するレイアウト */}
      <div className='p-4 mx-auto max-w-5xl min-h-screen '>
        {children}
      </div>
      <Footer />
    </div>
  )
}
