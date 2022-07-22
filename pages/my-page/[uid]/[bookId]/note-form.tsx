import { Card } from '@mantine/core'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Book } from 'types'
import { ErrorModal } from 'components/Modal/ErrorModal'
import { LabelInput } from 'components/NoteForm/LabelInput'
import { PageInput } from 'components/NoteForm/PageInput'
import { NoteInput } from 'components/NoteForm/NoteInput'
import { ClozeSwitch } from 'components/NoteForm/ClozeSwitch'
import { ClozeModal } from 'components/NoteForm/ClozeModal'
import { AddNoteButton } from 'components/NoteForm/AddNoteButton'

const NoteForm: NextPage = () => {
  const router = useRouter()
  const [targetBook, setTargetBook] = useState<Book | undefined>()
  const [opened, setOpened] = useState(false)
  const [label, setLabel] = useState('')
  const [page, setPage] = useState(0)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [cloze, setCloze] = useState(false)
  const [showClozeNote, setShowClozeNote] = useState(false)
  const [clozeNote, setClozeNote] = useState('')

  //マウント時にsessionStorageからデータを取得
  useEffect(() => {
    const jsonTargetBook = sessionStorage.getItem('targetBook')
    if (jsonTargetBook) {
      setTargetBook(JSON.parse(jsonTargetBook))
    }
  }, [])

  // clozeが切り替わったとき、clozeNoteを変更
  useEffect(() => {
    if (cloze) {
      setClozeNote(note)
    } else {
      setClozeNote('')
    }
  }, [cloze])

  return (
    <div className='mx-auto max-w-xl'>
      <ErrorModal error={error} setError={setError} />
      <ClozeModal
        clozeNote={clozeNote}
        setClozeNote={setClozeNote}
        opened={opened}
        setOpened={setOpened}
        note={note}
        setCloze={setCloze}
        setShowClozeNote={setShowClozeNote}
      />
      <div className='ml-2 max-w-lg text-3xl'>Note作成</div>
      <div className='mt-2 ml-4 text-lg text-dark-400'>
        - {targetBook?.title}
      </div>
      <div className='py-8 px-4 mt-6 mb-8 rounded-md border-dark-600 border-solid xs:px-6'>
        <div className='flex mr-4'>
          <LabelInput label={label} setLabel={setLabel} />
          <PageInput page={page} setPage={setPage} />
        </div>
        <NoteInput note={note} setNote={setNote} cloze={cloze} />
        <ClozeSwitch
          cloze={cloze}
          setCloze={setCloze}
          setOpened={setOpened}
          setShowClozeNote={setShowClozeNote}
        />
        {showClozeNote ? (
          <div>
            <div className='mb-2 text-sm font-semibold'>括弧抜き</div>
            <Card className='mb-4 min-h-[100px]'>{clozeNote}</Card>
          </div>
        ) : null}
      </div>
      <AddNoteButton
        targetBook={targetBook}
        router={router}
        label={label}
        page={page}
        note={note}
        clozeNote={clozeNote}
        setError={setError}
      />
    </div>
  )
}

export default NoteForm
