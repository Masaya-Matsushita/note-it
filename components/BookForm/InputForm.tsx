import { TextInput, Chips, Chip, Textarea, Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { setDoc, doc, addDoc, collection } from 'firebase/firestore'
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

  // badge,bookをデータベースに登録
  const addBook = async () => {
    if (state.title && state.badge) {
      if (state.edit) {
        console.log('hello')
      } else {
        // badgeを登録
        const chipsArray = state.badge.split(',')
        await setDoc(doc(db, 'users', uid, 'badges', chipsArray[1]), {
          priority: Number(chipsArray[0]),
          badge: chipsArray[1],
        })
        // bookを登録
        await addDoc(
          collection(db, 'users', uid, 'badges', chipsArray[1], 'books'),
          {
            title: state.title,
            overview: state.overview,
          }
        )
        // 登録後、ページ遷移
        showNotification({
          message: '登録完了！',
          autoClose: 3000,
          icon: <Check size={20} />,
        })
        router.push(`/my-page/${uid}`)
      }
    }
  }

  useEffect(() => {
    const jsonTargetBook = sessionStorage.getItem('targetBook')
    if (jsonTargetBook) {
      const targetBook = JSON.parse(jsonTargetBook)
      if (targetBook.title !== '') {
        dispatch({
          type: 'set',
          title: targetBook.title,
          badge: targetBook.badge,
          overview: targetBook.overview,
        })
      }
    }
  }, [])

  return (
    <div>
      <div className='ml-2 max-w-lg text-3xl'>
        Book {state.edit ? '更新' : '登録'}
      </div>
      <div className='p-4 py-6 mt-3 mb-6 rounded-md border-dark-600 border-solid xs:px-6'>
        <TextInput
          required
          label='Title'
          placeholder='タイトル(必須)'
          size='md'
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
          onClick={() => addBook()}
        >
          {state.edit ? '更新' : '登録'}
        </Button>
      </div>
    </div>
  )
}
