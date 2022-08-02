import { ItemMenu } from 'components/Parts/ItemMenu'
import { deleteDoc, doc } from 'firebase/firestore'
import db from 'firebaseConfig/firebase'
import { useSetItemAndRouter } from 'hooks/useSetItemAndRouter'
import { BookAction } from 'pages/my-page/[uid]/[badgeId]/[bookId]'
import { Dispatch, FC, useCallback } from 'react'
import { Note as NoteIcon } from 'tabler-icons-react'
import { Note, Notes } from 'types'

type Props = {
  notes: Notes
  openDialog: boolean
  uid: string | string[] | undefined
  badgeId: string
  bookId: string
  dispatch: Dispatch<BookAction>
}

export const NoteList: FC<Props> = ({
  notes,
  openDialog,
  uid,
  badgeId,
  bookId,
  dispatch,
}) => {
  const { setNoteAndTransition } = useSetItemAndRouter()

  // ブラウザにcurrentNoteを保存し、noteページへ
  const toNotePage = (note: Note) => {
    setNoteAndTransition(
      JSON.stringify(note),
      `/my-page/${uid}/${badgeId}/${bookId}/${note.id}`
    )
  }

  // ブラウザに空のcurrentNoteを保存し、note-formページへ
  const toNoteForm = () => {
    setNoteAndTransition(
      JSON.stringify({ id: '', label: '', page: 1, note: '', clozeNote: '' }),
      `/my-page/${uid}/${badgeId}/${bookId}/note-form`
    )
  }

  // ブラウザにcurrentNoteを保存し、note-formページへ
  const toEditPage = useCallback(
    (note: Note, id: string) => {
      setNoteAndTransition(
        JSON.stringify(note),
        `/my-page/${uid}/${badgeId}/${bookId}/note-form`,
        id
      )
    },
    [setNoteAndTransition, uid, badgeId, bookId]
  )

  // noteを削除
  const handleDelete = useCallback(
    async (noteId: string) => {
      if (typeof uid === 'string') {
        await deleteDoc(
          doc(
            db,
            'users',
            uid,
            'badges',
            badgeId,
            'books',
            bookId,
            'notes',
            noteId
          )
        )
        // useEffect内でnotesを再取得
        dispatch({ type: 'reloadNote' })
      }
    },
    [uid, badgeId, bookId, dispatch]
  )

  return (
    <div>
      <div className='mb-1 ml-2 text-2xl font-semibold'>Notes</div>
      <div className='grow border border-dark-400 border-solid'></div>
      {notes.length ? (
        <div className='mx-2'>
          <div className='flex mt-4 mb-1 text-sm text-dark-300 xs:text-base'>
            <div className='ml-2 w-[72px]'>Page</div>
            <div>Label</div>
          </div>
          {notes.map((note) => {
            return (
              <div key={note.id}>
                <div className='flex justify-between items-center mb-2 text-dark-100 bg-dark-700 hover:bg-dark-600 hover:cursor-pointer sm:text-xl'>
                  <div
                    onClick={() => {
                      toNotePage(note)
                    }}
                    className='py-2 pl-4 w-20'
                  >
                    {note.page}
                  </div>
                  <div
                    onClick={() => {
                      toNotePage(note)
                    }}
                    className='flex-1 py-2'
                  >
                    {innerWidth < 300 && note.label.length > 8
                      ? note.label.slice(0, 8) + '...'
                      : innerWidth < 320 && note.label.length > 11
                      ? note.label.slice(0, 11) + '...'
                      : innerWidth < 370 && note.label.length > 15
                      ? note.label.slice(0, 15) + '...'
                      : innerWidth < 460 && note.label.length > 20
                      ? note.label.slice(0, 20) + '...'
                      : innerWidth < 550 && note.label.length > 30
                      ? note.label.slice(0, 30) + '...'
                      : innerWidth < 680 && note.label.length > 40
                      ? note.label.slice(0, 40) + '...'
                      : note.label}
                  </div>
                  <ItemMenu
                    label={
                      note.label.length > 20
                        ? note.label.slice(0, 20) + '...'
                        : note.label
                    }
                    toEditPage={() => toEditPage(note, note.id)}
                    handleDelete={() => handleDelete(note.id)}
                    openDialog={openDialog}
                    dispatch={dispatch}
                  />
                </div>
              </div>
            )
          })}
          <div
            className='py-1 mx-4 mt-4 text-sm text-center text-dark-200 bg-dark-700 hover:bg-dark-600 hover:cursor-pointer xs:py-2 xs:mx-8 xs:text-base'
            onClick={() => toNoteForm()}
          >
            + 追加
          </div>
        </div>
      ) : (
        <div>
          <div className='mt-8 xs:mt-16'>
            <NoteIcon
              size={'160px'}
              strokeWidth={1.5}
              color={'#2b2c31'}
              className='block mx-auto'
            />
            <div className='text-lg text-center text-dark-400 xs:text-xl'>
              <div>Noteがありません。</div>
            </div>
          </div>
          <div
            className='py-2 mx-auto mt-8 mb-16 w-52 text-center text-dark-200 bg-dark-700 hover:bg-dark-600 hover:cursor-pointer xs:mt-12'
            onClick={() => toNoteForm()}
          >
            + 作成
          </div>
        </div>
      )}
    </div>
  )
}
