import { Loader } from '@mantine/core'
import { BookDetail } from 'components/Book/BookDetail'
import { NoteList } from 'components/Book/NoteList'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BookAndNotes, Notes } from 'types'

const Book: NextPage = () => {
  const router = useRouter()
  const [bookAndNotes, setBookAndNotes] = useState<BookAndNotes>()

  // bookとnotesを取得しbookAndNotesへ追加
  const createBookAndNotes = async () => {
    onAuthStateChanged(auth, async (user) => {
      const jsonTargetBook = sessionStorage.getItem('targetBook')
      if (user && jsonTargetBook) {
        const targetBook = JSON.parse(jsonTargetBook)
        // bookのnotesを取得
        const noteSnap = await getDocs(
          collection(
            db,
            'users',
            user.uid,
            'badges',
            targetBook.badge,
            'books',
            targetBook.bookId,
            'notes'
          )
        )
        // notesを整形・並べ替えしてbookAndNotesへ追加
        const notes: Notes = []
        noteSnap.forEach((note) => {
          notes.push({
            id: note.id,
            label: note.data().label,
            page: note.data().page,
          })
        })
        notes.sort((a, b) => {
          if (a.page < b.page) {
            return -1
          } else if (a.page > b.page) {
            return 1
          } else {
            return 0
          }
        })
        setBookAndNotes({ book: targetBook, notes: notes })
      }
    })
  }

  useEffect(() => {
    createBookAndNotes()
  }, [])

  return (
    <>
      {bookAndNotes ? (
        <div className='mx-auto max-w-3xl'>
          <BookDetail book={bookAndNotes.book} />
          <NoteList bookAndNotes={bookAndNotes} router={router} />
        </div>
      ) : (
        <Loader size='xl' className='fixed inset-0 m-auto' />
      )}
    </>
  )
}

export default Book
