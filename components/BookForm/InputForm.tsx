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
import { NextRouter } from 'next/router'
import { FC, useCallback, useEffect } from 'react'
import { Book2, Check } from 'tabler-icons-react'
import { Reducer, useReducer } from 'react'

type Props = {
  router: NextRouter
  uid: string
}

type State = typeof initialState

type Action = {
  type: 'set' | 'title' | 'badge' | 'overview' | 'error'
} & Partial<State>

const initialState = {
  title: '',
  badge: '1,学校',
  overview: '',
  initBadge: '',
  error: false,
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'set': {
      return {
        ...state,
        title: action.title ? action.title : '',
        badge: action.badge ? action.badge : '',
        initBadge: action.badge ? action.badge : '',
        overview: action.overview ? action.overview : '',
      }
    }
    case 'title': {
      return {
        ...state,
        title: action.title ? action.title : '',
      }
    }
    case 'badge': {
      return {
        ...state,
        badge: action.badge ? action.badge : '',
      }
    }
    case 'overview': {
      return {
        ...state,
        overview: action.overview ? action.overview : '',
      }
    }
    case 'error': {
      return {
        ...state,
        error: true,
      }
    }
  }
}

export const InputForm: FC<Props> = ({ router, uid }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // badgeとbookを保存する
  const setBadgeAndBook = useCallback(
    async (badgeId: string, badgeLabel: string) => {
      await setDoc(doc(db, 'users', uid, 'badges', badgeId), {
        badge: badgeLabel,
      })
      await addDoc(collection(db, 'users', uid, 'badges', badgeId, 'books'), {
        title: state.title,
        overview: state.overview,
      })
    },
    [uid, state.title, state.overview]
  )

  // badge,bookをデータベースに登録/更新
  const handleSubmit = useCallback(async () => {
    const title = state.title
    const badge = state.badge
    const initBadge = state.initBadge
    const overview = state.overview
    // フォームのバリデーション
    if (
      title.length < 2 ||
      50 < title.length ||
      200 < Number(overview.length)
    ) {
      dispatch({ type: 'error' })
      return
    }
    const [badgeId, badgeLabel] = badge.split(',')
    if (initBadge) {
      // 更新する場合
      const bookId = String(router.query.id)
      if (initBadge === badge) {
        // badgeの値は更新されない場合
        await updateDoc(
          doc(db, 'users', uid, 'badges', badgeId, 'books', bookId),
          {
            title: title,
            overview: overview,
          }
        )
      } else {
        // badgeの値も更新される場合
        const initBadgeId = initBadge.split(',')[0]
        await deleteDoc(
          doc(db, 'users', uid, 'badges', initBadgeId, 'books', bookId)
        )
        setBadgeAndBook(badgeId, badgeLabel)
      }
    } else {
      // 作成する場合
      setBadgeAndBook(badgeId, badgeLabel)
    }
    // ページ遷移
    showNotification({
      message: `${initBadge ? '更新' : '作成'}しました`,
      autoClose: 3000,
      icon: <Check size={20} />,
    })
    router.push(`/my-page/${uid}`)
  }, [
    router,
    setBadgeAndBook,
    state.badge,
    state.initBadge,
    state.overview,
    state.title,
    uid,
  ])

  // badgeの値を整形
  const exchangeBadgeValue = useCallback((badge: string) => {
    switch (badge) {
      case '学校': {
        return '1,学校'
      }
      case '試験': {
        return '2,試験'
      }
      case '研究': {
        return '3,研究'
      }
      case '資格': {
        return '4,資格'
      }
      case '研鑽': {
        return '5,研鑽'
      }
      case '教養': {
        return '6,教養'
      }
      case '趣味': {
        return '7,趣味'
      }
      case 'その他': {
        return '8,その他'
      }
    }
  }, [])

  useEffect(() => {
    // WebストレージからtargetBookを取得
    const jsonTargetBook = sessionStorage.getItem('targetBook')
    if (!jsonTargetBook) {
      return
    }
    const targetBook = JSON.parse(jsonTargetBook)
    if (targetBook.title !== '') {
      // 更新の場合
      const badgeValue = exchangeBadgeValue(targetBook.badge)
      // 値をフォームに代入
      dispatch({
        type: 'set',
        title: targetBook.title,
        badge: badgeValue,
        overview: targetBook.overview,
      })
    }
  }, [exchangeBadgeValue])

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
              ? state.title.length < 2 || 50 < state.title.length
                ? '2~50文字で入力してください。'
                : null
              : null
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
            state.error && 200 < state.overview.length
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
