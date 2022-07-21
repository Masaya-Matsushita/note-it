import { onAuthStateChanged } from 'firebase/auth'
import { doc, DocumentData, getDoc } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { number } from 'zod'

const Note: NextPage = () => {
  //   const router = useRouter()
  //   const [bookTitle, setBookTitle] = useState('')
  //   const [noteData, setNoteData] = useState<DocumentData>()

  //   const getNoteData = () => {
  //     onAuthStateChanged(auth, async (user) => {
  //       const jsonTargetNote = sessionStorage.getItem('targetNote')
  //       if (user && jsonTargetNote) {
  //         const targetNote = JSON.parse(jsonTargetNote)
  //         const noteSnap = await getDoc(
  //           doc(
  //             db,
  //             'users',
  //             user.uid,
  //             'badges',
  //             targetNote.badge,
  //             'books',
  //             targetNote.bookId,
  //             'notes',
  //             targetNote.noteId
  //           )
  //         )
  //         setBookTitle(targetNote.title)
  //         setNoteData(noteSnap.data())
  //       }
  //     })
  //   }

  //   useEffect(() => {
  //     getNoteData()
  //   }, [])

  //   function foo() {
  //     const selObj = window.getSelection();
  //     console.log(selObj);
  //     const selRange = selObj.getRangeAt(0);
  //     console.log(selRange);
  //     // 以下、取得した選択文字列に対して何らかの処理を行う
  // }

  const [str, setStr] = useState('')
  const [rangeList, setRangeList] = useState<
    {
      start: number
      end?: number
    }[]
  >([])

  const handleDisplay = () => {
    setStr('プロを目指す人のためのTypeScript入門')
    setRangeList([{ start: 1, end: 3 }, { start: 6, end: 11 }, { start: 21 }])
  }

  return (
    <>
      <button onClick={() => handleDisplay()}>btn</button>
      <div>
        {rangeList.map((range) => {
          return (
            <span key={range.start}>
              {range.start ? (
                <div className='inline-block mx-1 w-12 h-4 bg-dark-300'></div>
              ) : null}
              <span>{str.slice(range.start, range.end)}</span>
            </span>
          )
        })}
      </div>
      {/* {noteData ? (
        <div>
          <div>{bookTitle}</div>
          <div>{noteData.label}</div>
          <div>{noteData.page}</div>
          <div>{noteData.note}</div>
        </div>
      ) : null} */}
    </>
  )
}

export default Note
