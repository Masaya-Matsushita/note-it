import { Badge } from '@mantine/core'
import { FC } from 'react'
import { Book } from 'types'

type Props = {
  book: Pick<Book, 'badge' | 'title' | 'overview'>
}

export const BookDetail: FC<Props> = ({ book }) => {
  return (
    <div>
      <div className='flex items-end mt-6'>
        <div className='mr-2 text-3xl font-bold'>{book.title}</div>
        <Badge size='lg' className='shrink-0'>{book.badge}</Badge>
      </div>
      <div className='mx-4 mt-2 mb-8 min-h-[32px] text-lg text-dark-300 sm:text-xl'>
        {book.overview}
      </div>
    </div>
  )
}
