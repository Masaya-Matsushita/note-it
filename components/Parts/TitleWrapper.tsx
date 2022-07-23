import { FC, ReactNode } from "react"

type Props = {
  title: string
  subTitle: string
  children: ReactNode
}

export const TitleWrapper:FC<Props> = ({title, subTitle, children}) => {
  return (
    <div>
      <div className='my-4 text-2xl text-center sm:text-3xl'>
        {title}
      </div>
      <div className='text-center sm:text-lg'>
        {subTitle}
      </div>
      <div className='grow my-4 border border-dark-400 border-solid'></div>
      {children}
    </div>
  )
}
