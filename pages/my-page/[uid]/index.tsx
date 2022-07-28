import { UserProfileModal } from 'components/Modal/UserProfileModal'
import { useCallback, useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { Loader } from '@mantine/core'
import { BookList } from 'components/MyPage/BookList'
import { Books, BadgeAndBooksList } from 'types'
import { ToCreateBookButton } from 'components/MyPage/ToCreateBookButton'
import { Reducer, useReducer } from 'react'

type State = {
  pageLoading: boolean
  opened: boolean
  badgeAndBooksList?: BadgeAndBooksList | undefined
}

type Action = {
  type: 'opened' | 'setList'
} & Partial<State>

const initialState = {
  opened: false,
  badgeAndBooksList: undefined,
  pageLoading: true,
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'opened': {
      return {
        ...state,
        opened: action.opened ?? false,
        pageLoading: false,
      }
    }
    case 'setList': {
      return {
        ...state,
        badgeAndBooksList: action.badgeAndBooksList,
        pageLoading: false,
      }
    }
  }
}

const Mypage: NextPage = () => {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)

  // badgesとbooksを取得しbadgeAndBooksListへ追加
  const createBadgeAndBooksList = useCallback(async (userId: string) => {
    // userのbadgesを取得
    const badgesSnap = await getDocs(collection(db, 'users', userId, 'badges'))
    if (badgesSnap.empty) {
      dispatch({
        type: 'setList',
        badgeAndBooksList: [],
      })
    } else {
      let badgeAndBooksArray: BadgeAndBooksList = []
      // 各badgeのbooksを取得
      badgesSnap.forEach(async (badge) => {
        const booksSnap = await getDocs(
          collection(db, 'users', userId, 'badges', badge.id, 'books')
        )
        // booksが空のbadgeは含めない
        if (!booksSnap.empty) {
          // 取得したbooksを配列booksへ
          let books: Books = []
          booksSnap.forEach((book) => {
            books = [
              ...books,
              {
                id: book.id,
                title: book.data().title,
                overview: book.data().overview,
              },
            ]
          })
          // 取得したbadgesとbooksをまとめて配列へ
          badgeAndBooksArray = [
            ...badgeAndBooksArray,
            {
              priority: Number(badge.id),
              badge: badge.data().badge,
              books: books,
            },
          ]
          // badgeのpriorityの値で並べ替え
          badgeAndBooksArray.sort((a, b) => {
            return a.priority - b.priority
          })
          // badgeAndBooksListへ追加
          dispatch({ type: 'setList', badgeAndBooksList: badgeAndBooksArray })
        }
      })
    }
  }, [])

  // userのドキュメントが存在するか判断
  const checkUserExists = useCallback(
    async (userId: string) => {
      const userSnap = await getDoc(doc(db, 'users', userId))
      if (userSnap.exists()) {
        createBadgeAndBooksList(userId)
      } else {
        dispatch({ type: 'opened', opened: true })
      }
    },
    [createBadgeAndBooksList]
  )

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // パスワードログインかつメール未認証のとき、no-verifiedページへ
      if (user) {
        if (
          user.providerData[0].providerId === 'password' &&
          user.emailVerified === false
        ) {
          router.push('/no-verified')
        } else {
          checkUserExists(user.uid)
        }
      }
    })
  }, [router, checkUserExists])

  return (
    <>
      {/* ユーザーが未認証の時はLoaderを表示 */}
      {state.pageLoading ? (
        <Loader size='xl' className='fixed inset-0 m-auto' />
      ) : (
        <>
          <UserProfileModal opened={state.opened} propsDispatch={dispatch} />
          <div className='min-h-screen'>
            <div className='mt-6 text-3xl'>My Books</div>
            <div className='grow my-2 border border-dark-400 border-solid'></div>
            <BookList badgeAndBooksList={state.badgeAndBooksList} />
          </div>
          <ToCreateBookButton />
        </>
      )}
    </>
  )
}

export default Mypage
