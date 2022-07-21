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
            targetNote.badge,
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

  // function foo() {
  //   const selObj = window.getSelection()
  //   console.log(selObj)
  //   const selRange = selObj.getRangeAt(0)
  //   console.log(selRange)
  //   // 以下、取得した選択文字列に対して何らかの処理を行う
  // }

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
