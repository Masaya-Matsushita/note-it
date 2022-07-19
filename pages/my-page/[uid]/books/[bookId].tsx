import { Badge, Card } from '@mantine/core'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Book, BookAndNotes, Notes } from 'types'

const Books: NextPage = () => {
  const router = useRouter()
  const [BookAndNotes, setBookAndNotes] = useState<BookAndNotes>()

  // const createBookAndNotes = async () => {
  //   onAuthStateChanged(auth, async (user) => {
  //     const jsonTargetBook = sessionStorage.getItem('targetBook')
  //     if (user && jsonTargetBook) {
  //       const targetBook = JSON.parse(jsonTargetBook)
  //       const noteSnap = await getDocs(
  //         collection(
  //           db,
  //           'users',
  //           user.uid,
  //           'badges',
  //           targetBook.badgeId,
  //           'books',
  //           targetBook.bookId,
  //           'notes'
  //         )
  //       )
  //       const notes: Notes = []
  //       noteSnap.forEach((note) => {
  //         notes.push({
  //           id: note.id,
  //           label: note.data().label,
  //           page: note.data().page,
  //         })
  //       })
  //       setBookAndNotes({ book: targetBook, notes: notes })
  //     }
  //   })
  // }

  // useEffect(() => {
  //   createBookAndNotes()
  // })

  return (
    <>
      {BookAndNotes ? (
        <div>
          <Badge>{BookAndNotes.book.badge}</Badge>
          <h1>{BookAndNotes.book.title}</h1>
          <div>{BookAndNotes.book.overview}</div>
          <h3>Notes</h3>
          {BookAndNotes.notes.map((note) => {
            return (
              <Card className='p-4 mt-4' key={note.id}>
                <div className='flex justify-between text-lg md:ml-2 md:text-xl'>
                  <div>{note.label}</div>
                  <div>{note.page}</div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : null}
    </>
  )
}

export default Books
