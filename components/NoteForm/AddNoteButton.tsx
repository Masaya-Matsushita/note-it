import { Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { addDoc, collection } from 'firebase/firestore'
import db from 'firebaseConfig/firebase'
import { NextRouter } from 'next/router'
import { Dispatch, FC } from 'react'
import { Check, Note } from 'tabler-icons-react'

type Props = {
  uid: string
  badgeId: string
  bookId: string
  router: NextRouter
  label: string
  page: number
  note: string
  clozeNote: string
  dispatch: Dispatch<any>
}

export const AddNoteButton: FC<Props> = ({
  uid,
  badgeId,
  bookId,
  router,
  label,
  page,
  note,
  clozeNote,
  dispatch,
}) => {
  // noteをデータベースに登録
  const addNote = async () => {
    // フォームのバリデーション
    if (label.length <= 50 && note.length <= 500) {
      if (label.length > 0 && note.length > 0 && page !== null) {
        // データベースに登録
        await addDoc(
          collection(
            db,
            'users',
            uid,
            'badges',
            badgeId,
            'books',
            bookId,
            'notes'
          ),
          {
            label: label,
            page: page,
            note: note,
            clozeNote: clozeNote,
          }
        )
        // 登録後、ページ遷移
        showNotification({
          message: '作成完了！',
          autoClose: 3000,
          icon: <Check size={20} />,
        })
        router.push(`/my-page/${uid}/${badgeId}/${bookId}`)
      } else {
        dispatch({ type: 'error', error: 'note/required-form' })
      }
    }
  }

  return (
    <div className='mx-4'>
      <Button
        className='w-full h-10 text-base xs:h-12 xs:text-lg'
        leftIcon={<Note size={18} />}
        onClick={() => addNote()}
      >
        作成
      </Button>
    </div>
  )
}
