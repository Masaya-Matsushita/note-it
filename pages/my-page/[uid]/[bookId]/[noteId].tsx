import { onAuthStateChanged } from 'firebase/auth'
import { doc, DocumentData, getDoc } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Note: NextPage = () => {
  const router = useRouter()
  const [bookTitle, setBookTitle] = useState('')
  const [noteData, setNoteData] = useState<DocumentData>()

  const getNoteData = () => {
    onAuthStateChanged(auth, async (user) => {
      const jsonTargetNote = sessionStorage.getItem('targetNote')
      if (user && jsonTargetNote) {
        const targetNote = JSON.parse(jsonTargetNote)
        const noteSnap = await getDoc(
          doc(
            db,
            'users',
            user.uid,
            'badges',
            targetNote.badgeId,
            'books',
            targetNote.bookId,
            'notes',
            targetNote.noteId
          )
        )
        setBookTitle(targetNote.title)
        setNoteData(noteSnap.data())
      }
    })
  }

  useEffect(() => {
    getNoteData()
  }, [])

  return (
    <>
      {noteData ? (
        <div>
          <div>{bookTitle}</div>
          <div>{noteData.label}</div>
          <div>{noteData.page}</div>
          <div>{noteData.note}</div>
        </div>
      ) : null}
    </>
  )
}

export default Note
