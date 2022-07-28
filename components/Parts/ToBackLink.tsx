import Link from 'next/link'
import { FC, memo } from 'react'

type Props = {
  href: string
  text: string | null
}

// eslint-disable-next-line react/display-name
export const ToBackLink: FC<Props> = memo(({ href, text }) => {
  return (
    <div className='flex justify-start mt-10 ml-2 xs:mt-14 xs:ml-4'>
      <Link href={href} passHref>
        <a className='py-1 px-2 text-dark-300 no-underline'>← {text} へ戻る</a>
      </Link>
    </div>
  )
})
