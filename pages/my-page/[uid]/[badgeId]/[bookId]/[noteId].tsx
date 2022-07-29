import { Button } from '@mantine/core'
import { NoteDisplay } from 'components/Note/NoteDisplay'
import { BreadCrumbs } from 'components/Parts/BreadCrumbs'
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

  return (
    <>
      <div className=''>
        <BreadCrumbs
          page='note'
          book={currentBook.title}
          note={currentNote.label}
          uid={uid}
          badgeId={badgeId}
          bookId={bookId}
        />
        <div className='px-2 mx-auto mt-8 max-w-xl md:px-0'>
          <div className='text-2xl font-semibold text-dark-100 sm:text-3xl'>
            {currentNote.label}
          </div>
          <div className='flex justify-end items-center my-4 mr-4 xs:mr-8'>
            <div className='text-xl'>Page :</div>
            <div className='inline-block py-1 px-2 ml-2 text-xl font-semibold bg-dark-600 rounded-md'>
              {currentNote.page}
            </div>
          </div>
          <NoteDisplay currentNote={currentNote} />
          <div className='xs:mx-12'>
            <Link href={`/my-page/${uid}/${badgeId}/${bookId}`} passHref>
              <Button className='w-full'>戻る</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Note
