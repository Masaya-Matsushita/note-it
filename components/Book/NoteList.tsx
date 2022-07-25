import { ItemMenu } from 'components/Parts/ItemMenu'
import { deleteDoc, doc } from 'firebase/firestore'
import db from 'firebaseConfig/firebase'
import { NextRouter } from 'next/router'
import { FC } from 'react'
import { Note } from 'tabler-icons-react'
import { Book, Notes } from 'types'

type Props = {
  book: Book
  notes: Notes
  router: NextRouter
  uid: string
  badgeId: string
  bookId: string
}

type TargetNote = {
  title: string
  note: {
    id: string
    label: string
    page: number
    note: string
    clozeNote: string
  }
}

export const NoteList: FC<Props> = ({
  book,
  notes,
  router,
  uid,
  badgeId,
  bookId,
}) => {
  const toNotePage = (targetNote: TargetNote) => {
    sessionStorage.setItem('targetNote', JSON.stringify(targetNote))
    router.push(`/my-page/${uid}/${badgeId}/${bookId}/${targetNote.note.id}`)
  }

  const toNoteForm = (target: any) => {
    sessionStorage.setItem('targetNote', JSON.stringify(target))
    router.push(`/my-page/${uid}/${badgeId}/${bookId}/note-form`)
  }

  // ブラウザにtargetNoteを保存し、note-formページへ
  const toEditPage = (target: any, targetId: string) => {
    sessionStorage.setItem('targetNote', JSON.stringify(target))
    router.push({
      pathname: `/my-page/${uid}/${badgeId}/${bookId}/note-form`,
      query: { id: targetId },
    })
  }

  // noteを削除
  const handleDelete = async (noteId: string) => {
    await deleteDoc(
      doc(db, 'users', uid, 'badges', badgeId, 'books', bookId, 'notes', noteId)
    )
    location.reload()
  }

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
                      const targetNote = {
                        title: book.title,
                        note: note,
                      }
                      toNotePage(targetNote)
                    }}
                    className='py-2 pl-4 w-20'
                  >
                    {note.page}
                  </div>
                  <div
                    onClick={() => {
                      const targetNote = {
                        title: book.title,
                        note: {
                          id: '',
                          label: '',
                          page: 0,
                          note: '',
                          clozeNote: '',
                        },
                      }
                      toNotePage(targetNote)
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
                page: '0',
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
            <Note
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
                page: 0,
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
