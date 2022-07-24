import { TextInput, Chips, Chip, Textarea, Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import {
  setDoc,
  doc,
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import db from 'firebaseConfig/firebase'
import { useBookFormState } from 'hooks/StateManagement/useBookFormState'
import { NextRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { Book2, Check } from 'tabler-icons-react'

type Props = {
  router: NextRouter
  uid: string
}

export const InputForm: FC<Props> = ({ router, uid }) => {
  const { state, dispatch } = useBookFormState()

  // badge,bookをデータベースに登録/更新
  const handleSubmit = async () => {
    if (state.title && state.badge) {
      if (
        state.title.length < 2 ||
        50 < state.title.length ||
        200 < Number(state.overview?.length)
      ) {
        // フォームのバリデーションエラー
        dispatch({ type: 'error' })
      } else {
        const badgeArray = state.badge.split(',')
        if (state.initBadge) {
          // 更新する場合
          const bookId = String(router.query.id)
          if (state.initBadge === state.badge) {
            // badgeの値は更新されない場合
            await updateDoc(
              doc(db, 'users', uid, 'badges', badgeArray[0], 'books', bookId),
              {
                title: state.title,
                overview: state.overview,
              }
            )
          } else {
            // badgeの値も更新される場合
            const initBadgeId = state.initBadge.split(',')[0]
            await deleteDoc(
              doc(db, 'users', uid, 'badges', initBadgeId, 'books', bookId)
            )
            await setDoc(doc(db, 'users', uid, 'badges', badgeArray[0]), {
              badge: badgeArray[1],
            })
            await addDoc(
              collection(db, 'users', uid, 'badges', badgeArray[0], 'books'),
              {
                title: state.title,
                overview: state.overview,
              }
            )
          }
        } else {
          // 登録する場合
          await setDoc(doc(db, 'users', uid, 'badges', badgeArray[0]), {
            badge: badgeArray[1],
          })
          await addDoc(
            collection(db, 'users', uid, 'badges', badgeArray[0], 'books'),
            {
              title: state.title,
              overview: state.overview,
            }
          )
        }
        // ページ遷移（共通)
        showNotification({
          message: `${state.initBadge ? '更新' : '登録'}しました`,
          autoClose: 3000,
          icon: <Check size={20} />,
        })
        router.push(`/my-page/${uid}`)
      }
    }
  }

  useEffect(() => {
    // WebストレージからtargetBookを取得
    const jsonTargetBook = sessionStorage.getItem('targetBook')
    if (jsonTargetBook) {
      const targetBook = JSON.parse(jsonTargetBook)
      if (targetBook.title !== '') {
        // 更新の場合
        // badgeの値を整形
        let badgeValue = ''
        switch (targetBook.badge) {
          case '学校': {
            badgeValue = '1,学校'
            break
          }
          case '試験': {
            badgeValue = '2,試験'
            break
          }
          case '研究': {
            badgeValue = '3,研究'
            break
          }
          case '資格': {
            badgeValue = '4,資格'
            break
          }
          case '研鑽': {
            badgeValue = '5,研鑽'
            break
          }
          case '教養': {
            badgeValue = '6,教養'
            break
          }
          case '趣味': {
            badgeValue = '7,趣味'
            break
          }
          case 'その他': {
            badgeValue = '8,その他'
            break
          }
        }
        // 値をフォームに代入
        dispatch({
          type: 'set',
          title: targetBook.title,
          badge: badgeValue,
          overview: targetBook.overview,
        })
      }
    }
  }, [])

  return (
    <div>
      <div className='ml-2 max-w-lg text-3xl'>
        Book {state.initBadge ? '更新' : '登録'}
      </div>
      <div className='p-4 py-6 mt-3 mb-6 rounded-md border-dark-600 border-solid xs:px-6'>
        <TextInput
          required
          label='Title'
          placeholder='タイトル(必須)'
          size='md'
          error={
            state.error
              ? Number(state.title?.length) < 2 ||
                50 < Number(state.title?.length)
                ? '2~50文字で入力してください。'
                : false
              : false
          }
          value={state.title}
          onChange={(e) =>
            dispatch({ type: 'title', title: e.currentTarget.value })
          }
        />
        <div className='mt-4 mb-2 font-medium'>Badge</div>
        <Chips
          value={state.badge}
          onChange={(e) => dispatch({ type: 'badge', badge: String(e) })}
        >
          <Chip value='1,学校'>学校</Chip>
          <Chip value='2,試験'>試験</Chip>
          <Chip value='3,研究'>研究</Chip>
          <Chip value='4,資格'>資格</Chip>
          <Chip value='5,研鑽'>研鑽</Chip>
          <Chip value='6,教養'>教養</Chip>
          <Chip value='7,趣味'>趣味</Chip>
          <Chip value='8,その他'>その他</Chip>
        </Chips>
        <Textarea
          label='Overview'
          placeholder='概要、メモなど'
          size='md'
          error={
            state.error && 200 < Number(state.overview?.length)
              ? '200文字以内で入力してください。'
              : false
          }
          value={state.overview}
          onChange={(e) =>
            dispatch({ type: 'overview', overview: e.currentTarget.value })
          }
          className='mt-4 mb-1'
        />
      </div>
      <div className='mx-4'>
        <Button
          className='w-full h-10 text-base xs:h-12 xs:text-lg'
          leftIcon={<Book2 size={18} />}
          onClick={() => handleSubmit()}
        >
          {state.initBadge ? '更新' : '登録'}
        </Button>
      </div>
    </div>
  )
}
