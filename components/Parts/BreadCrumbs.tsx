import { Anchor, Breadcrumbs } from '@mantine/core'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'

type Props = {
  page: 'my-page' | 'book-form' | 'book' | 'note-form' | 'note'
  book?: string
  note?: string
  uid?: string | string[] | undefined
  badgeId?: string | string[] | undefined
  bookId?: string | string[] | undefined
}

export const BreadCrumbs: FC<Props> = ({
  page,
  book,
  note,
  uid,
  badgeId,
  bookId,
}) => {
  const [bookLabel, setBookLabel] = useState('')
  const [noteLabel, setNoteLabel] = useState('')

  useEffect(() => {
    if (book) {
      setBookLabel(book?.length > 7 ? book?.slice(0, 7) + '...' : book)
    }
    if (note) {
      setNoteLabel(note?.length > 7 ? note?.slice(0, 7) + '...' : note)
    }
  }, [book, note])

  const itemsArr = () => {
    switch (page) {
      case 'my-page': {
        return [{ label: 'My Books', href: '#' }]
      }
      case 'book-form': {
        return [
          { label: 'My Books', href: `/my-page/${uid}` },
          { label: 'Form', href: '#' },
        ]
      }
      case 'book': {
        return [
          { label: 'My Books', href: `/my-page/${uid}` },
          {
            label: bookLabel,
            href: '#',
          },
        ]
      }
      case 'note-form': {
        return [
          { label: 'My Books', href: `/my-page/${uid}` },
          {
            label: bookLabel,
            href: `/my-page/${uid}/${badgeId}/${bookId}`,
          },
          { label: 'Form', href: '#' },
        ]
      }
      case 'note': {
        return [
          { label: 'My Books', href: `/my-page/${uid}` },
          {
            label: bookLabel,
            href: `/my-page/${uid}/${badgeId}/${bookId}`,
          },
          {
            label: noteLabel,
            href: '#',
          },
        ]
      }
      default: {
        throw new Error('no such page!')
      }
    }
  }
  return (
    <Breadcrumbs
      className='flex flex-wrap mb-4 md:mb-6'
      classNames={{ separator: 'hidden' }}
    >
      {itemsArr().map((item) => {
        return (
          <div key={item.label}>
            <span
              className={item.label === 'My Books' ? 'hidden' : 'mr-3 ml-1'}
            >
              /
            </span>
            <Link href={item.href} passHref>
              <Anchor className='mr-2 whitespace-nowrap'>{item.label}</Anchor>
            </Link>
          </div>
        )
      })}
    </Breadcrumbs>
  )
}
