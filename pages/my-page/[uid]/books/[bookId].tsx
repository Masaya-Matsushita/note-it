import { Badge, Card } from '@mantine/core'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type BookData = {
  book: {
    typeId: string
    type: string
    bookId: string
    title: string
    overview: string
  }
  notes: { id: string; label: string; page: number }[]
}

type Notes = { id: string; label: string; page: number }[]

const Books: NextPage = () => {
  const router = useRouter()
  const [bookData, setBookData] = useState<BookData>()

  const createBookData = async () => {
    onAuthStateChanged(auth, async (user) => {
      const jsonTargetBook = sessionStorage.getItem('targetBook')
      if (user && jsonTargetBook) {
        const targetBook = JSON.parse(jsonTargetBook)
        // getDocsが何回も呼ばれている気がする
        // console.log('called')
        const noteSnap = await getDocs(
          collection(
            db,
            'users',
            user.uid,
            'types',
            targetBook.typeId,
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
        setBookData({ book: targetBook, notes: notes })
      }
    })
  }

  useEffect(() => {
    createBookData()
  })

  return (
    <>
      {bookData ? (
        <div>
          <Badge>{bookData.book.type}</Badge>
          <h1>{bookData.book.title}</h1>
          <div>{bookData.book.overview}</div>
          <h3>Notes</h3>
          {bookData.notes.map((note) => {
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
