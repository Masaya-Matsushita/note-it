import { Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import db from 'firebaseConfig/firebase'
import { NextRouter } from 'next/router'
import { NoteFormAction } from 'pages/my-page/[uid]/[badgeId]/[bookId]/note-form'
import { Dispatch, FC, memo } from 'react'
import { Check, Note } from 'tabler-icons-react'

type Props = {
  uid: string
  badgeId: string
  bookId: string
  router: NextRouter
  edit: boolean
  label: string
  page: number
  note: string
  clozeNote: string
  dispatch: Dispatch<NoteFormAction>
}

// eslint-disable-next-line react/display-name
export const AddNoteButton: FC<Props> = memo(
  ({
    uid,
    badgeId,
    bookId,
    router,
    edit,
    label,
    page,
    note,
    clozeNote,
    dispatch,
  }) => {
    const noteId: string | undefined = String(router.query.id)

    // noteをデータベースに登録
    const handleSubmit = async () => {
      // フォームのバリデーション
      if (50 < label.length || 500 < note.length) {
        return
      }
      if (label.length === 0 || note.length === 0 || !page) {
        dispatch({ type: 'error', error: 'note/required-form' })
        return
      }
      if (edit) {
        // 更新する場合
        await updateDoc(
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
          ),
          {
            label: label,
            page: page,
            note: note,
            clozeNote: clozeNote,
          }
        )
      } else {
        // 作成する場合
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
      }
      // ページ遷移
      showNotification({
        message: `${edit ? '更新' : '作成'}しました`,
        autoClose: 3000,
        icon: <Check size={20} />,
      })
      router.push(`/my-page/${uid}/${badgeId}/${bookId}`)
    }

    return (
      <div className='mx-4'>
        <Button
          className='w-full h-10 text-base xs:h-12 xs:text-lg'
          leftIcon={<Note size={18} />}
          onClick={() => handleSubmit()}
        >
          {edit ? '更新' : '作成'}
        </Button>
      </div>
    )
  }
)
