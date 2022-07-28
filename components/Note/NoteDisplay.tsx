import { DocumentData } from 'firebase/firestore'
import { FC, memo, useState } from 'react'

type Props = {
  noteData: DocumentData
}

// eslint-disable-next-line react/display-name
export const NoteDisplay: FC<Props> = memo(({ noteData }) => {
  const [hideCloze, setHideCloze] = useState(false)

  // clozeNoteが無い(空文字)の場合
  if (!noteData.clozeNote) {
    return (
      <div className='p-4 mx-2 mb-12 text-lg tracking-wider leading-7 bg-dark-600 rounded-md xs:p-6 xs:mx-6'>
        {noteData.note}
      </div>
    )
  }

  return (
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
  )
})
