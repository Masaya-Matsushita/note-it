import { Anchor, Breadcrumbs, Button } from '@mantine/core'
import { NoteDisplay } from 'components/Note/NoteDisplay'
import { useGetItem } from 'hooks/useGetItem'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Note: NextPage = () => {
  const router = useRouter()
  const uid = String(router.query.uid)
  const badgeId = String(router.query.badgeId)
  const bookId = String(router.query.bookId)
  const { currentBook, currentNote } = useGetItem()

  const breadItems = [
    { label: 'My Books', href: `/my-page/${uid}` },
    {
      label: `${
        currentBook.title.length > 7
          ? currentBook.title.slice(0, 7) + '...'
          : currentBook.title
      }`,
      href: `/my-page/${uid}/${badgeId}/${bookId}`,
    },
    {
      label: `${
        currentNote.label.length > 7
          ? currentNote.label.slice(0, 7) + '...'
          : currentNote.label
      }`,
      href: '#',
    },
  ].map((item) => {
    return (
      <div key={item.label}>
        <span className={item.label === 'My Books' ? 'hidden' : 'mr-3 ml-1'}>
          /
        </span>
        <Link href={item.href} passHref>
          <Anchor className='mr-2 whitespace-nowrap'>{item.label}</Anchor>
        </Link>
      </div>
    )
  })

  return (
    <>
      <div className='mx-auto max-w-xl'>
        <Breadcrumbs
          className='flex flex-wrap'
          classNames={{ separator: 'hidden' }}
        >
          {breadItems}
        </Breadcrumbs>
        <div className='mt-4 ml-2 text-3xl font-bold'>{currentNote.label}</div>
        <div className='flex justify-end items-center mr-4 mb-4 xs:mr-8'>
          <div className='text-xl'>Page :</div>
          <div className='inline-block py-1 px-2 ml-2 text-xl font-semibold bg-dark-600 rounded-md'>
            {currentNote.page}
          </div>
        </div>
        <NoteDisplay currentNote={currentNote} />
        <div className='mx-2 xs:mx-6'>
          <Link href={`/my-page/${uid}/${badgeId}/${bookId}`} passHref>
            <Button className='w-full'>戻る</Button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Note
