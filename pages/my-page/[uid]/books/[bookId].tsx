import { Badge, Card } from '@mantine/core'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BookAndNotes, Notes } from 'types'

const Books: NextPage = () => {
  const router = useRouter()
  const [BookAndNotes, setBookAndNotes] = useState<BookAndNotes>()

  const createBookAndNotes = async () => {
    onAuthStateChanged(auth, async (user) => {
      const jsonTargetBook = sessionStorage.getItem('targetBook')
      if (user && jsonTargetBook) {
        const targetBook = JSON.parse(jsonTargetBook)
        const noteSnap = await getDocs(
          collection(
            db,
            'users',
            user.uid,
            'badges',
            targetBook.badgeId,
            'books',
            targetBook.bookId,
            'notes'
          )
        )
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
      {BookAndNotes ? (
        <div>
          <div className='inline mr-2 text-3xl font-bold'>{BookAndNotes.book.title}</div>
          <Badge size='lg'>{BookAndNotes.book.badge}</Badge>
          <div className='mx-4 mt-2 mb-8 text-lg text-dark-300 sm:text-xl'>
            {BookAndNotes.book.overview}
          </div>
          <div className='mb-0 ml-4 text-xl font-bold'>Notes</div>
          <div className='grow mx-2 border border-dark-400 border-solid'></div>
          {/* <div className='flex justify-between my-2'>
            <div className='ml-6 text-sm text-dark-300'>Label</div>
            <div className='mr-8 text-sm text-dark-300'>Page</div>
          </div> */}
          {BookAndNotes.notes.map((note) => {
            return (
              <Card className='p-2 mx-4 mt-4 xs:mx-8 md:p-4' key={note.id}>
                <div className='flex justify-between md:ml-2 md:text-lg'>
                  <div className='ml-4'>{note.label}</div>
                  <div className='py-1 px-2 mr-4 text-dark-200 bg-dark-800 rounded-md'>
                    {note.page}
                  </div>
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
