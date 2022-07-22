import { Button } from '@mantine/core'
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
          {/* <div>{bookId}</div> */}
          <div className='mt-4 ml-2 text-3xl font-bold'>{noteData.label}</div>
          <div className='flex justify-end items-center mr-4 mb-4 xs:mr-8'>
            <div className='text-xl'>Page :</div>
            <div className='inline-block py-1 px-2 ml-2 text-xl font-semibold bg-dark-600 rounded-md'>
              {noteData.page}
            </div>
          </div>
          {noteData.clozeNote ? (
            <div>
              <div className='flex ml-2 xs:ml-6'>
                <div
                  className={
                    hideCloze
                      ? 'text-lg text-dark-300 py-2 px-6 rounded-t-md'
                      : 'bg-dark-700 font-bold py-2 px-6 rounded-t-md text-lg'
                  }
                  onClick={() => setHideCloze(false)}
                >
                  括弧抜き
                </div>
                <div
                  className={
                    hideCloze
                      ? 'bg-dark-700 font-bold py-2 px-6 rounded-t-md text-lg'
                      : 'text-lg text-dark-300 py-2 px-6 rounded-t-md'
                  }
                  onClick={() => setHideCloze(true)}
                >
                  平文
                </div>
              </div>
              <div className='grow mb-2 border border-dark-600 border-solid xs:mx-4'></div>
              <div className='p-4 mx-2 mb-12 text-lg tracking-wider leading-7 bg-dark-600 rounded-md xs:p-6 xs:mx-6'>
                {hideCloze ? noteData.note : noteData.clozeNote}
              </div>
            </div>
          ) : (
            <div className='p-4 mx-2 mb-12 text-lg tracking-wider leading-7 bg-dark-600 rounded-md xs:p-6 xs:mx-6'>
              {noteData.note}
            </div>
          )}
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
