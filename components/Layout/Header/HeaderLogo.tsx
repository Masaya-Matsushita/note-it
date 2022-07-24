import Link from 'next/link'
import { FC } from 'react'

type Props = { uid?: string | string[] }

export const HeaderLogo: FC<Props> = (uid) => {
  return (
    <Link href={uid ? `/my-page/${uid}` : '/'}>
      <a className='ml-6 text-2xl text-dark-100 no-underline hover:cursor-pointer sm:ml-12 sm:text-3xl'>
        Note It
      </a>
    </Link>
  )
}
