import { Button } from '@mantine/core'
import { NoteDisplay } from 'components/Note/NoteDisplay'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, DocumentData, getDoc } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Note: NextPage = () => {
  const router = useRouter()
  const [bookId, setBookId] = useState('')
  const [noteData, setNoteData] = useState<DocumentData>()
  const [hideCloze, setHideCloze] = useState(false)

  // noteを取得
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
        setBookId(targetNote.bookId)
        setNoteData(noteSnap.data())
      }
    })
  }

  useEffect(() => {
    getNoteData()
  }, [])

  // bookページへ遷移
  const toBookPage = () => {
    const user = auth.currentUser
    if (user) {
      router.push(`/my-page/${user.uid}/${bookId}`)
    }
  }

  return (
    <>
      {noteData ? (
        <div className='mx-auto max-w-xl'>
          <div className='mt-4 ml-2 text-3xl font-bold'>{noteData.label}</div>
          <div className='flex justify-end items-center mr-4 mb-4 xs:mr-8'>
            <div className='text-xl'>Page :</div>
            <div className='inline-block py-1 px-2 ml-2 text-xl font-semibold bg-dark-600 rounded-md'>
              {noteData.page}
            </div>
          </div>
          <NoteDisplay
            noteData={noteData}
            hideCloze={hideCloze}
            setHideCloze={setHideCloze}
          />
          <div className='mx-2 xs:mx-6'>
            <Button className='w-full' onClick={() => toBookPage()}>
              戻る
            </Button>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Note
