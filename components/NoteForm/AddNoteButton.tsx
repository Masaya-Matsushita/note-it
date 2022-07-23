import { Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { addDoc, collection } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { NextRouter } from 'next/router'
import { Dispatch, FC, SetStateAction } from 'react'
import { Check, Note } from 'tabler-icons-react'
import { Book } from 'types'

type Props = {
  targetBook: Book | undefined
  uid: string
  router: NextRouter
  label: string
  page: number
  note: string
  clozeNote: string
  setError: Dispatch<SetStateAction<string>>
}

export const AddNoteButton: FC<Props> = ({
  targetBook,
  uid,
  router,
  label,
  page,
  note,
  clozeNote,
  setError,
}) => {
  // noteをデータベースに登録
  const addNote = async () => {
    // フォームのバリデーション
    if (targetBook && label.length <= 50 && note.length <= 500) {
      if (label.length > 0 && note.length > 0 && page !== null) {
        // データベースに登録
        await addDoc(
          collection(
            db,
            'users',
            uid,
            'badges',
            targetBook.badge,
            'books',
            targetBook.bookId,
            'notes'
          ),
          {
            label: String(label),
            page: Number(page),
            note: String(note),
            clozeNote: String(clozeNote),
          }
        )
        // 登録後、ページ遷移
        showNotification({
          message: '作成完了！',
          autoClose: 3000,
          icon: <Check size={20} />,
        })
        router.push(`/my-page/${uid}/${targetBook.bookId}`)
      } else {
        setError('note/required-form')
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
