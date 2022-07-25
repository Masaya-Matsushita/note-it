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
import { ToBackLink } from 'components/Parts/ToBackLink'
import { auth } from 'firebaseConfig/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useNoteFormState } from 'hooks/StateManagement/useNoteFormState'

const NoteForm: NextPage = () => {
  const router = useRouter()
  // const [targetBook, setTargetBook] = useState<Book | undefined>()
  // const [uid, setUid] = useState('')
  // const [opened, setOpened] = useState(false)
  // const [label, setLabel] = useState('')
  // const [page, setPage] = useState(0)
  // const [note, setNote] = useState('')
  // const [error, setError] = useState('')
  // const [cloze, setCloze] = useState(false)
  // const [showClozeNote, setShowClozeNote] = useState(false)
  // const [clozeNote, setClozeNote] = useState('')
  const { state, dispatch } = useNoteFormState()
  const uid = String(router.query.uid)
  const badgeId = String(router.query.badgeId)
  const bookId = String(router.query.bookId)
  let targetBook: Book = { title: '', badge: '', overview: '' }

  //マウント時にsessionStorageからデータを取得
  useEffect(() => {
    const jsonTargetBook = sessionStorage.getItem('targetBook')
    if (jsonTargetBook) {
      targetBook = JSON.parse(jsonTargetBook)
    }
  }, [])

  // clozeが切り替わったとき、clozeNoteを変更
  useEffect(() => {
    if (state.cloze) {
      dispatch({ type: 'clozeNote', clozeNote: state.note })
    } else {
      dispatch({ type: 'clozeNote', clozeNote: '' })
    }
  }, [state.cloze])

  return (
    <div className='mx-auto max-w-xl'>
      <ErrorModal error={state.error} dispatch={dispatch} />
      <ClozeModal
        clozeNote={state.clozeNote}
        // setClozeNote={setClozeNote}
        opened={state.opened}
        // setOpened={setOpened}
        note={state.note}
        // setCloze={setCloze}
        // setShowClozeNote={setShowClozeNote}
        dispatch={dispatch}
      />
      <div className='ml-2 max-w-lg text-3xl'>Note作成</div>
      <div className='mt-2 ml-4 text-lg text-dark-400'>
        - {targetBook.title}
      </div>
      <div className='py-8 px-4 mt-6 mb-8 rounded-md border-dark-600 border-solid xs:px-6'>
        <div className='flex mr-4'>
          <LabelInput label={state.label} dispatch={dispatch} />
          <PageInput page={state.page} dispatch={dispatch} />
        </div>
        <NoteInput note={state.note} cloze={state.cloze} dispatch={dispatch} />
        <ClozeSwitch
          cloze={state.cloze}
          // setCloze={setCloze}
          // setOpened={setOpened}
          // setShowClozeNote={setShowClozeNote}
          dispatch={dispatch}
        />
        {state.showClozeNote ? (
          <div>
            <div className='mb-2 text-sm font-semibold'>括弧抜き</div>
            <Card className='mb-4 min-h-[100px]'>{state.clozeNote}</Card>
          </div>
        ) : null}
      </div>
      <AddNoteButton
        uid={uid}
        badgeId={badgeId}
        bookId={bookId}
        router={router}
        label={state.label}
        page={state.page}
        note={state.note}
        clozeNote={state.clozeNote}
        dispatch={dispatch}
      />
      <ToBackLink
        text={
          targetBook.title.length > 10
            ? `「${targetBook.title.slice(0, 10)}...」`
            : `「${targetBook.title}」`
        }
        href={`/my-page/${uid}/${badgeId}/${bookId}`}
      />
    </div>
  )
}

export default NoteForm
