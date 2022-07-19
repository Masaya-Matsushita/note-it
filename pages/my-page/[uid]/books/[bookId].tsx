import { Badge, Card } from '@mantine/core'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Books: NextPage = () => {
  const router = useRouter()
  const [bookAndNoteData, setBookAndNoteData] = useState<{
    book: {
      typeId: string
      type: string
      bookId: string
      title: string
      overview: string
    }
    notes: { id: string; label: string; page: number }[]
  }>()

  const getBookData = async () => {
    onAuthStateChanged(auth, async (user) => {
      const jsonBookData = sessionStorage.getItem('bookData')
      if (user && jsonBookData) {
        const bookData = JSON.parse(jsonBookData)
        // getDocsが何回も呼ばれている気がする
        // console.log('called')
        const noteSnap = await getDocs(
          collection(
            db,
            'users',
            user.uid,
            'types',
            bookData.typeId,
            'books',
            bookData.bookId,
            'notes'
          )
        )
        const notes: { id: string; label: string; page: number }[] = []
        noteSnap.forEach((note) => {
          notes.push({
            id: note.id,
            label: note.data().label,
            page: note.data().page,
          })
        })
        setBookAndNoteData({ book: bookData, notes: notes })
      }
    })
  }

  useEffect(() => {
    getBookData()
  })

  return (
    <>
      {bookAndNoteData ? (
        <div>
          <Badge>{bookAndNoteData.book.type}</Badge>
          <h1>{bookAndNoteData.book.title}</h1>
          <div>{bookAndNoteData.book.overview}</div>
          <h3>Notes</h3>
          {bookAndNoteData.notes.map((note) => {
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
