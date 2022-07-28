import { Loader } from '@mantine/core'
import { BookDetail } from 'components/Book/BookDetail'
import { NoteList } from 'components/Book/NoteList'
import { ToBackLink } from 'components/Parts/ToBackLink'
import { collection, getDocs } from 'firebase/firestore'
import db from 'firebaseConfig/firebase'
import { useGetDataFromSessionStorage } from 'hooks/useGetDataFromSessionStorage'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BookAndNotes, Notes } from 'types'

const Book: NextPage = () => {
  const router = useRouter()
  const uid = String(router.query.uid)
  const badgeId = String(router.query.badgeId)
  const bookId = String(router.query.bookId)
  const [bookAndNotes, setBookAndNotes] = useState<BookAndNotes | undefined>()
  const { currentBook } = useGetDataFromSessionStorage()

  // bookAndNotesに取得したデータを代入
  useEffect(() => {
    ;(async () => {
      // notesを取得
      const noteSnap = await getDocs(
        collection(
          db,
          'users',
          uid,
          'badges',
          badgeId,
          'books',
          bookId,
          'notes'
        )
      )
      let notes: Notes = []
      // 取得したデータを配列へ追加
      noteSnap.forEach((note) => {
        notes = [
          ...notes,
          {
            id: note.id,
            label: note.data().label,
            page: note.data().page,
            note: note.data().note,
            clozeNote: note.data().clozeNote,
          },
        ]
      })
      // 配列のデータをpage昇順で並べ替え
      notes.sort((a, b) => {
        return a.page - b.page
      })
      setBookAndNotes({
        book: {
          title: currentBook.title,
          badge: currentBook.badge,
          overview: currentBook.overview,
        },
        notes: notes,
      })
    })()
  }, [badgeId, bookId, currentBook, uid])

  return (
    <>
      {!bookAndNotes ? (
        <Loader size='xl' className='fixed inset-0 m-auto' />
      ) : (
        <div className='mx-auto max-w-3xl'>
          <BookDetail book={bookAndNotes.book} />
          <NoteList
            notes={bookAndNotes.notes}
            router={router}
            uid={uid}
            badgeId={badgeId}
            bookId={bookId}
          />
          <div className='flex justify-start mt-10 ml-2 xs:mt-14 xs:ml-4'>
            <ToBackLink text='Home' href={`/my-page/${uid}`} />
          </div>
        </div>
      )}
    </>
  )
}

export default Book
