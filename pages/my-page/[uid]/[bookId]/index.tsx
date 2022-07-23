import { Loader } from '@mantine/core'
import { BookDetail } from 'components/Book/BookDetail'
import { NoteList } from 'components/Book/NoteList'
import { ToBackLink } from 'components/Parts/ToBackLink'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BookAndNotes, Notes } from 'types'

const Book: NextPage = () => {
  const router = useRouter()
  const [uid, setUid] = useState('')
  const [bookAndNotes, setBookAndNotes] = useState<BookAndNotes>()

  // bookとnotesを取得しbookAndNotesへ追加
  const createBookAndNotes = async (uid: string) => {
    const jsonTargetBook = sessionStorage.getItem('targetBook')
    if (jsonTargetBook) {
      const targetBook = JSON.parse(jsonTargetBook)
      // bookのnotesを取得
      const noteSnap = await getDocs(
        collection(
          db,
          'users',
          uid,
          'badges',
          targetBook.badge,
          'books',
          targetBook.bookId,
          'notes'
        )
      )
      // notesを整形・並べ替えしてbookAndNotesへ追加
      let notes: Notes = []
      noteSnap.forEach((note) => {
        notes = [
          ...notes,
          {
            id: note.id,
            label: note.data().label,
            page: note.data().page,
          },
        ]
      })
      notes.sort((a, b) => {
        return a.page - b.page
      })
      setBookAndNotes({ book: targetBook, notes: notes })
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid)
        createBookAndNotes(user.uid)
      }
    })
  }, [])

  return (
    <>
      {bookAndNotes ? (
        <div className='mx-auto max-w-3xl'>
          <BookDetail book={bookAndNotes.book} />
          <NoteList bookAndNotes={bookAndNotes} router={router} />
          <div className='flex justify-start mt-10 ml-2 xs:mt-14 xs:ml-4'>
            <ToBackLink text='Home' href={`/my-page/${uid}`} />
          </div>
        </div>
      ) : (
        <Loader size='xl' className='fixed inset-0 m-auto' />
      )}
    </>
  )
}

export default Book
