import { Card } from '@mantine/core'
import { auth } from 'firebaseConfig/firebase'
import { NextRouter } from 'next/router'
import { FC } from 'react'
import { BookAndNotes } from 'types'

type Props = {
  bookAndNotes: BookAndNotes
  router: NextRouter
}

type TargetNote = {
  badgeId: string
  bookId: string
  title: string
  noteId: string
}

export const NoteList: FC<Props> = ({ bookAndNotes, router }) => {
  const toNotePage = (targetNote: TargetNote) => {
    const user = auth.currentUser
    if (user) {
      sessionStorage.setItem('targetNote', JSON.stringify(targetNote))
      router.push(
        `/my-page/${user.uid}/${targetNote.bookId}/${targetNote.noteId}`
      )
    }
  }

  return (
    <div>
      <div className='mb-1 ml-4 text-2xl font-semibold'>Notes</div>
      <div className='grow mx-2 border border-dark-400 border-solid'></div>
      {bookAndNotes.notes.length ? (
        <div>
          <div className='flex justify-between mt-4 mb-1'>
            <div className='ml-8 text-sm text-dark-300 xs:ml-16 xs:text-base'>
              Label
            </div>
            <div className='mr-12 text-sm text-dark-300 xs:mr-[72px] xs:text-base'>
              Page
            </div>
          </div>
          {bookAndNotes.notes.map((note) => {
            return (
              <Card
                className='group p-2 mx-4 mb-4 hover:bg-dark-600 hover:cursor-pointer xs:p-4 xs:mx-8'
                key={note.id}
                onClick={() => {
                  const targetNote = {
                    badgeId: bookAndNotes.book.badgeId,
                    bookId: bookAndNotes.book.bookId,
                    title: bookAndNotes.book.title,
                    noteId: note.id,
                  }
                  toNotePage(targetNote)
                }}
              >
                <div className='flex justify-between xs:text-lg md:ml-2'>
                  <div className='ml-4'>{note.label}</div>
                  <div className='py-1 px-2 mr-4 text-dark-200 bg-dark-800 group-hover:bg-dark-700 rounded-md'>
                    {note.page}
                  </div>
                </div>
              </Card>
            )
          })}
          <Card className='py-1 mx-4 text-sm font-semibold text-center text-dark-200 bg-dark-700 hover:bg-dark-600 hover:cursor-pointer xs:py-2 xs:mx-8 xs:text-base'>
            + 追加
          </Card>
        </div>
      ) : (
        <div>
          <div className='mt-8 mb-4 text-center'>Noteがありません。</div>
          <Card className='block py-2 mx-auto w-52 font-semibold text-center text-dark-200 bg-dark-700 hover:bg-dark-600 hover:cursor-pointer'>
            + 作成
          </Card>
        </div>
      )}
    </div>
  )
}
