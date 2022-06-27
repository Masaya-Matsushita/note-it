import { FC, ReactNode } from 'react'
import { BrowserTab } from './BrowserTab'

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <BrowserTab />
      <div className='p-4 mx-auto max-w-4xl'>{children}</div>
    </div>
  )
}
