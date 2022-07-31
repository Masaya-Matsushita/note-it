import { Loader } from '@mantine/core'
import { BookDetail } from 'components/Book/BookDetail'
import { NoteList } from 'components/Book/NoteList'
import { BreadCrumbs } from 'components/Parts/BreadCrumbs'
import { ToBackLink } from 'components/Parts/ToBackLink'
import { collection, getDocs } from 'firebase/firestore'
import db from 'firebaseConfig/firebase'
import { useGetItem } from 'hooks/useGetItem'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Reducer, useEffect, useReducer } from 'react'
import { BookAndNotes, Notes } from 'types'

export type BookState = {
  bookAndNotes: BookAndNotes | undefined
  reloadNote: boolean
  openDialog: boolean
}

export type BookAction = {
  type: keyof typeof initialState
} & Partial<BookState>

const initialState = {
  bookAndNotes: undefined,
  reloadNote: false,
  openDialog: false,
}

const reducer: Reducer<BookState, BookAction> = (state, action) => {
  switch (action.type) {
    case 'bookAndNotes': {
      return {
        ...state,
        bookAndNotes: action.bookAndNotes ?? undefined,
      }
    }
    case 'reloadNote': {
      return {
        ...state,
        reloadNote: !state.reloadNote,
        openDialog: false,
      }
    }
    case 'openDialog': {
      return {
        ...state,
        openDialog: action.openDialog ?? false,
      }
    }
  }
}

const Book: NextPage = () => {
  const router = useRouter()
  const uid = router.query.uid
  const badgeId = String(router.query.badgeId)
  const bookId = String(router.query.bookId)
  const [state, dispatch] = useReducer(reducer, initialState)
  const { currentBook } = useGetItem()

  // bookAndNotesに取得したデータを代入
  useEffect(() => {
    ;(async () => {
      // notesを取得
      if (typeof uid === 'string') {
        const noteSnap = await getDocs(
          collection(
            db,
            'users',
            uid,
            'badges',
            badgeId,
            'books',
            bookId,
            'notes'
          )
        )
        let notes: Notes = []
        // 取得したデータを配列へ追加
        noteSnap.forEach((note) => {
          notes = [
            ...notes,
            {
              id: note.id,
              label: note.data().label,
              page: note.data().page,
              note: note.data().note,
              clozeNote: note.data().clozeNote,
            },
          ]
        })
        // 配列のデータをpage昇順で並べ替え
        notes.sort((a, b) => {
          return a.page - b.page
        })
        dispatch({
          type: 'bookAndNotes',
          bookAndNotes: {
            book: {
              title: currentBook.title,
              badge: currentBook.badge,
              overview: currentBook.overview,
            },
            notes: notes,
          },
        })
      }
    })()
  }, [badgeId, bookId, currentBook, uid, state.reloadNote])

  return (
    <>
      {!state.bookAndNotes ? (
        <Loader size='xl' className='fixed inset-0 m-auto' />
      ) : (
        <div>
          <BreadCrumbs page='book' book={currentBook.title} uid={uid} />
          <div className='px-2 mx-auto max-w-3xl md:px-0'>
            <BookDetail book={state.bookAndNotes.book} />
            <NoteList
              notes={state.bookAndNotes.notes}
              openDialog={state.openDialog}
              uid={uid}
              badgeId={badgeId}
              bookId={bookId}
              dispatch={dispatch}
            />
            <ToBackLink text='Home' href={`/my-page/${uid}`} />
          </div>
        </div>
      )}
    </>
  )
}

export default Book
