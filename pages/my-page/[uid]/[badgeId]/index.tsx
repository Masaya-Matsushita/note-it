import { Loader } from '@mantine/core'
import { BookDetail } from 'components/Book/BookDetail'
import { NoteList } from 'components/Book/NoteList'
import { ToBackLink } from 'components/Parts/ToBackLink'
import { collection, getDocs } from 'firebase/firestore'
import db from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Book, Notes } from 'types'

const Book: NextPage = () => {
  const router = useRouter()
  const uid = String(router.query.uid)
  const badgeId = String(router.query.badgeId)
  const bookId = String(router.query.bookId)
  // const [bookAndNotes, setBookAndNotes] = useState<BookAndNotes>()
  let book: Book = { title: '', badge: '', overview: '' }
  let notes: Notes = []
  const [loading, setLoading] = useState(true)

  // bookに値を代入
  const setBook = () => {
    const jsonTargetBook = sessionStorage.getItem('targetBook')
    if (jsonTargetBook) {
      book = JSON.parse(jsonTargetBook)
    }
  }

  // notesに値を代入
  const setNotes = async () => {
    // notesを取得
    const noteSnap = await getDocs(
      collection(db, 'users', uid, 'badges', badgeId, 'books', bookId, 'notes')
    )
    // notesへ追加
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
    // page昇順で並べ替え
    notes.sort((a, b) => {
      return a.page - b.page
    })
    setLoading(false)
  }

  useEffect(() => {
    setBook()
    setNotes()
  }, [router])

  return (
    <>
      {loading ? (
        <Loader size='xl' className='fixed inset-0 m-auto' />
      ) : (
        <div className='mx-auto max-w-3xl'>
          <BookDetail book={book} />
          <NoteList
            book={book}
            notes={notes}
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
