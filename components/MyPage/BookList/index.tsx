import { FC } from 'react'
import { BadgeAndBooksList } from 'types'
import { ListContent } from './ListContent'

type Props = {
  badgeAndBooksList: BadgeAndBooksList | undefined
}

export const BookList: FC<Props> = ({ badgeAndBooksList }) => {
  return (
    <div className='min-h-screen'>
      <div className='mt-6 text-3xl'>My Books</div>
      <div className='grow my-2 border border-dark-400 border-solid'></div>
      <ListContent badgeAndBooksList={badgeAndBooksList} />
    </div>
  )
}
