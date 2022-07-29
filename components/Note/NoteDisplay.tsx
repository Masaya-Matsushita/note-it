import { DocumentData } from 'firebase/firestore'
import { FC, memo, useState } from 'react'

type Props = {
  currentNote: DocumentData
}

// eslint-disable-next-line react/display-name
export const NoteDisplay: FC<Props> = memo(({ currentNote }) => {
  const [hideCloze, setHideCloze] = useState(false)

  // clozeNoteが無い(空文字)の場合
  if (!currentNote.clozeNote) {
    return (
      <div className='p-4 mb-12 text-lg tracking-wider leading-7 bg-dark-700 rounded-md xs:p-8 xs:mx-6'>
        {currentNote.note}
      </div>
    )
  }

  return (
    <div>
      <div className='flex ml-2 xs:ml-6'>
        <div
          className={
            hideCloze
              ? 'text-lg text-dark-300 py-1 px-6 rounded-t-md'
              : 'bg-dark-700 font-bold py-1 px-6 rounded-t-md text-lg'
          }
          onClick={() => setHideCloze(false)}
        >
          括弧抜き
        </div>
        <div
          className={
            hideCloze
              ? 'bg-dark-700 font-bold py-1 px-6 rounded-t-md text-lg'
              : 'text-lg text-dark-300 py-1 px-6 rounded-t-md'
          }
          onClick={() => setHideCloze(true)}
        >
          平文
        </div>
      </div>
      <div className='grow mb-4 border border-dark-600 border-solid xs:mx-4'></div>
      <div className='p-4 mb-12 text-lg tracking-wider leading-7 bg-dark-700 rounded-md xs:py-6 xs:px-8 xs:mx-10'>
        {hideCloze ? currentNote.note : currentNote.clozeNote}
      </div>
    </div>
  )
})
