import { Card } from '@mantine/core'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ErrorModal } from 'components/Modal/ErrorModal'
import { LabelInput } from 'components/NoteForm/LabelInput'
import { PageInput } from 'components/NoteForm/PageInput'
import { NoteInput } from 'components/NoteForm/NoteInput'
import { ClozeSwitch } from 'components/NoteForm/ClozeSwitch'
import { ClozeModal } from 'components/NoteForm/ClozeModal'
import { AddNoteButton } from 'components/NoteForm/AddNoteButton'
import { ToBackLink } from 'components/Parts/ToBackLink'
import { useNoteFormState } from 'hooks/StateManagement/useNoteFormState'

const NoteForm: NextPage = () => {
  const router = useRouter()

  const { state, dispatch } = useNoteFormState()
  const uid = String(router.query.uid)
  const badgeId = String(router.query.badgeId)
  const bookId = String(router.query.bookId)

  //マウント時にsessionStorageからデータを取得
  useEffect(() => {
    const jsonTargetBook = sessionStorage.getItem('targetBook')
    const jsonTargetNote = sessionStorage.getItem('targetNote')
    if (jsonTargetBook && jsonTargetNote) {
      const targetBook = JSON.parse(jsonTargetBook)
      const targetNote = JSON.parse(jsonTargetNote)
      // 編集の場合、フォームに値を代入
      if (targetNote.label !== '') {
        dispatch({
          type: 'setBookAndNote',
          edit: true,
          title: targetBook.title,
          label: targetNote.label,
          page: Number(targetNote.page),
          note: targetNote.note,
          cloze: true,
          showClozeNote: true,
        })
      } else {
        dispatch({ type: 'setBook', title: targetBook.title })
      }
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
        opened={state.opened}
        note={state.note}
        dispatch={dispatch}
      />
      <div className='ml-2 max-w-lg text-3xl'>Note作成</div>
      <div className='mt-2 ml-4 text-lg text-dark-400'>- {state.title}</div>
      <div className='py-8 px-4 mt-6 mb-8 rounded-md border-dark-600 border-solid xs:px-6'>
        <div className='flex mr-4'>
          <LabelInput label={state.label} dispatch={dispatch} />
          <PageInput page={state.page} dispatch={dispatch} />
        </div>
        <NoteInput note={state.note} cloze={state.cloze} dispatch={dispatch} />
        <ClozeSwitch cloze={state.cloze} dispatch={dispatch} />
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
        edit={state.edit}
        label={state.label}
        page={state.page}
        note={state.note}
        clozeNote={state.clozeNote}
        dispatch={dispatch}
      />
      <ToBackLink
        text={
          state.title.length > 10
            ? `「${state.title.slice(0, 10)}...」`
            : `「${state.title}」`
        }
        href={`/my-page/${uid}/${badgeId}/${bookId}`}
      />
    </div>
  )
}

export default NoteForm
