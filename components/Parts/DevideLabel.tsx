import { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const DevideLabel: FC<Props> = ({ children }) => {
  return (
    <div className='flex items-center mt-12 mb-2 xs:mt-16 lg:mt-20'>
      <div className='grow ml-4 border border-dark-500 border-solid xs:ml-8 sm:ml-12 md:ml-12'></div>
      {children}
      <div className='grow mr-4 border border-dark-500 border-solid xs:mr-8 sm:mr-12 md:mr-12'></div>
    </div>
  )
}
