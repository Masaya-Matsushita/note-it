import { Badge } from '@mantine/core'
import { FC } from 'react'
import { Book } from 'types'

type Props = {
  book: Pick<Book, 'badge' | 'title' | 'overview'>
}

export const BookDetail: FC<Props> = ({ book }) => {
  return (
    <div>
      <div className='inline mr-2 text-3xl font-bold'>{book.title}</div>
      <Badge size='lg'>{book.badge}</Badge>
      <div className='mx-4 mt-2 mb-8 text-lg text-dark-300 sm:text-xl'>
        {book.overview}
      </div>
    </div>
  )
}
