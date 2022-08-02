import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ErrorModal } from 'components/Parts/ErrorModal'
import { LabelInput } from 'components/NoteForm/LabelInput'
import { PageInput } from 'components/NoteForm/PageInput'
import { NoteInput } from 'components/NoteForm/NoteInput'
import { ClozeSwitch } from 'components/NoteForm/ClozeSwitch'
import { ClozeModal } from 'components/NoteForm/ClozeModal'
import { AddNoteButton } from 'components/NoteForm/AddNoteButton'
import { ToBackLink } from 'components/Parts/ToBackLink'
import { Reducer, useReducer } from 'react'
import { ClozeNoteDisplay } from 'components/NoteForm/ClozeNoteDisplay'
import { useGetItem } from 'hooks/useGetItem'
import { BreadCrumbs } from 'components/Parts/BreadCrumbs'

export type NoteFormState = typeof initialState

export type NoteFormAction = {
  type:
    | 'opened'
    | 'label'
    | 'page'
    | 'error'
    | 'resetError'
    | 'cloze'
    | 'note'
    | 'showClozeNote'
    | 'clozeNote'
    | 'cancelClozeModal'
    | 'okClozeModal'
    | 'toggleClozeSwitch'
    | 'setBookAndNote'
    | 'setBook'
} & Partial<NoteFormState>

const initialState = {
  edit: false,
  opened: false,
  title: '',
  label: '',
  page: 1,
  note: '',
  error: '',
  cloze: false,
  showClozeNote: false,
  clozeNote: '',
  throughSetClozeNote: false,
}

const reducer: Reducer<NoteFormState, NoteFormAction> = (state, action) => {
  switch (action.type) {
    case 'opened':
      return {
        ...state,
        opened: action.opened ?? false,
      }
    case 'label':
      return {
        ...state,
        label: action.label ?? '',
      }
    case 'page':
      return {
        ...state,
        page: action.page ?? 0,
      }
    case 'note':
      return {
        ...state,
        note: action.note ?? '',
      }
    case 'error':
      return {
        ...state,
        error: action.error ?? '',
      }
    case 'resetError': {
      return {
        ...state,
        error: action.error ?? '',
      }
    }
    case 'cloze':
      return {
        ...state,
        cloze: action.cloze ?? false,
      }
    case 'showClozeNote':
      return {
        ...state,
        showClozeNote: action.showClozeNote ?? false,
      }
    case 'clozeNote':
      return {
        ...state,
        clozeNote: action.clozeNote ?? '',
      }
    case 'cancelClozeModal':
      return {
        ...state,
        cloze: action.cloze ?? false,
        opened: action.opened ?? false,
      }
    case 'okClozeModal':
      return {
        ...state,
        showClozeNote: action.showClozeNote ?? false,
        opened: action.opened ?? false,
      }
    case 'toggleClozeSwitch':
      return {
        ...state,
        cloze: action.cloze ?? false,
        opened: action.opened ?? false,
        showClozeNote: false,
        throughSetClozeNote: false,
      }
    case 'setBook':
      return {
        ...state,
        title: action.title ?? '',
      }
    case 'setBookAndNote':
      return {
        ...state,
        edit: action.edit ?? false,
        title: action.title ?? '',
        label: action.label ?? '',
        page: action.page ?? 0,
        note: action.note ?? '',
        cloze: action.cloze ?? false,
        showClozeNote: action.showClozeNote ?? false,
        clozeNote: action.clozeNote ?? '',
        throughSetClozeNote: true,
      }
  }
}

const NoteForm: NextPage = () => {
  const router = useRouter()
  const uid = String(router.query.uid)
  const badgeId = String(router.query.badgeId)
  const bookId = String(router.query.bookId)
  const [state, dispatch] = useReducer(reducer, initialState)
  const { currentBook, currentNote } = useGetItem()

  // clozeが切り替わったとき、clozeNoteを変更
  useEffect(() => {
    // 編集の場合、マウント時にclozeNoteが上書きされるのを阻止
    if (!state.throughSetClozeNote) {
      if (state.cloze) {
        dispatch({ type: 'clozeNote', clozeNote: state.note })
      } else {
        dispatch({ type: 'clozeNote', clozeNote: '' })
      }
    }
  }, [state.throughSetClozeNote, state.cloze, state.note])

  useEffect(() => {
    // 編集の場合、フォームに値を代入
    if (currentNote.label) {
      dispatch({
        type: 'setBookAndNote',
        edit: true,
        title: currentBook.title,
        label: currentNote.label,
        page: Number(currentNote.page),
        note: currentNote.note,
        cloze: Boolean(currentNote.clozeNote),
        showClozeNote: Boolean(currentNote.clozeNote),
        clozeNote: currentNote.clozeNote,
      })
    } else {
      dispatch({ type: 'setBook', title: currentBook.title })
    }
  }, [currentBook, currentNote])

  return (
    <div className='mx-auto max-w-xl'>
      <ErrorModal error={state.error} dispatch={dispatch} />
      <ClozeModal
        clozeNote={state.clozeNote}
        opened={state.opened}
        note={state.note}
        dispatch={dispatch}
      />
      <BreadCrumbs
        page='note-form'
        book={currentBook.title}
        uid={uid}
        badgeId={badgeId}
        bookId={bookId}
      />
      <div className='ml-2 max-w-lg text-3xl'>
        Note{state.edit ? '更新' : '作成'}
      </div>
      <div className='mt-1 ml-4 text-lg text-dark-400'>- {state.title}</div>
      <div className='py-8 px-4 mt-2 mb-8 rounded-md border-dark-600 border-solid xs:px-6'>
        <div className='flex mr-4'>
          <LabelInput label={state.label} dispatch={dispatch} />
          <PageInput page={state.page} dispatch={dispatch} />
        </div>
        <NoteInput note={state.note} cloze={state.cloze} dispatch={dispatch} />
        <ClozeSwitch cloze={state.cloze} dispatch={dispatch} />
        <ClozeNoteDisplay
          clozeNote={state.clozeNote}
          isShow={state.showClozeNote}
        />
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
