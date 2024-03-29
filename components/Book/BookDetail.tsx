import { Badge } from '@mantine/core'
import { FC, memo } from 'react'
import { Book } from 'types'

type Props = { book: Book }

// eslint-disable-next-line react/display-name
export const BookDetail: FC<Props> = memo(({ book }) => {
  return (
    <div>
      <div className='flex items-end'>
        <div className='mr-2 text-3xl font-semibold md:text-4xl'>{book.title}</div>
        <Badge size='lg' className='shrink-0'>
          {book.badge}
        </Badge>
      </div>
      <div className='mx-4 mt-2 mb-8 min-h-[32px] text-lg text-dark-300 sm:text-xl'>
        {book.overview}
      </div>
    </div>
  )
})
