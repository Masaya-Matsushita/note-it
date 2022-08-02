import Link from 'next/link'
import { FC, memo } from 'react'

type Props = {
  href: string
  text: string | null
}

// eslint-disable-next-line react/display-name
export const ToBackLink: FC<Props> = memo(({ href, text }) => {
  return (
    <div className='flex justify-center mt-10 xs:mt-14'>
      <Link href={href} passHref>
        <a className='py-2 px-4 tracking-wider text-dark-300 no-underline'>
          ← {text} へ戻る
        </a>
      </Link>
    </div>
  )
})
