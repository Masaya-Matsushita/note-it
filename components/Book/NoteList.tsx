import { ItemMenu } from 'components/Parts/ItemMenu'
import { deleteDoc, doc } from 'firebase/firestore'
import db from 'firebaseConfig/firebase'
import { NextRouter } from 'next/router'
import { FC, useCallback } from 'react'
import { Note as NoteIcon } from 'tabler-icons-react'
import { Note, Notes } from 'types'

type Props = {
  notes: Notes
  router: NextRouter
  uid: string | string[] | undefined
  badgeId: string
  bookId: string
}

export const NoteList: FC<Props> = ({
  notes,
  router,
  uid,
  badgeId,
  bookId,
}) => {
  const toNotePage = (currentNote: Note) => {
    sessionStorage.setItem('currentNote', JSON.stringify(currentNote))
    router.push(`/my-page/${uid}/${badgeId}/${bookId}/${currentNote.id}`)
  }

  const toNoteForm = (currentNote: Note) => {
    sessionStorage.setItem('currentNote', JSON.stringify(currentNote))
    router.push(`/my-page/${uid}/${badgeId}/${bookId}/note-form`)
  }

  // ブラウザにtargetNoteを保存し、note-formページへ
  const toEditPage = useCallback(
    (currentNote: Note, targetId: string) => {
      sessionStorage.setItem('currentNote', JSON.stringify(currentNote))
      router.push({
        pathname: `/my-page/${uid}/${badgeId}/${bookId}/note-form`,
        query: { id: targetId },
      })
    },
    [router, uid, badgeId, bookId]
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
        location.reload()
      }
    },
    [uid, badgeId, bookId]
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
                  />
                </div>
              </div>
            )
          })}
          <div
            className='py-1 mx-4 mt-4 text-sm text-center text-dark-200 bg-dark-700 hover:bg-dark-600 hover:cursor-pointer xs:py-2 xs:mx-8 xs:text-base'
            onClick={() =>
              toNoteForm({
                id: '',
                label: '',
                page: 1,
                note: '',
                clozeNote: '',
              })
            }
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
            className='py-2 mx-auto mt-8 w-52 text-center text-dark-200 bg-dark-700 hover:bg-dark-600 hover:cursor-pointer xs:mt-12'
            onClick={() =>
              toNoteForm({
                id: '',
                label: '',
                page: 1,
                note: '',
                clozeNote: '',
              })
            }
          >
            + 作成
          </div>
        </div>
      )}
    </div>
  )
}
