import { UserProfileModal } from 'components/Modal/UserProfileModal'
import { useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { Loader } from '@mantine/core'
import { BookList } from 'components/MyPage/BookList'
import { Books, BadgeAndBooksList } from 'types'
import { ToCreateBookButton } from 'components/MyPage/ToCreateBookButton'
import { useMypageState } from 'hooks/StateManagement/useMypageState'

const Mypage: NextPage = () => {
  const router = useRouter()
  const { state, dispatch } = useMypageState()

  // userのドキュメントが存在するか判断
  const checkUserExists = async (userId: string) => {
    const userSnap = await getDoc(doc(db, 'users', userId))
    if (userSnap.exists()) {
      createBadgeAndBooksList(userId)
    } else {
      dispatch({ type: 'opened', opened: true })
    }
  }

  // badgesとbooksを取得しbadgeAndBooksListへ追加
  const createBadgeAndBooksList = async (userId: string) => {
    // userのbadgesを取得
    const badgesSnap = await getDocs(collection(db, 'users', userId, 'badges'))
    let badgeAndBooksArray: BadgeAndBooksList = []
    // 各badgeのbooksを取得
    badgesSnap.forEach(async (badge) => {
      const booksSnap = await getDocs(
        collection(db, 'users', userId, 'badges', badge.id, 'books')
      )
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
          priority: badge.data().priority,
          badge: badge.data().badge,
          books: books,
        },
      ]
      // badgeのpriorityの値で並べ替え
      badgeAndBooksArray.sort((a, b) => {
        return a.priority - b.priority
      })
      // badgeAndBooksListへ追加
      if (badgeAndBooksArray.length) {
        dispatch({ type: 'setList', badgeAndBooksList: badgeAndBooksArray })
      } else {
        dispatch({ type: 'setList', badgeAndBooksList: [] })
      }
    })
  }

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
          dispatch({ type: 'pageLoading', pageLoading: false })
        }
      }
    })
  }, [])

  return (
    <>
      {/* ユーザーが未認証の時はLoaderを表示 */}
      {state.pageLoading ? (
        <Loader size='xl' className='fixed inset-0 m-auto' />
      ) : (
        <>
          <UserProfileModal opened={state.opened} propsDispatch={dispatch} />
          <BookList badgeAndBooksList={state.badgeAndBooksList} />
          <ToCreateBookButton router={router} />
        </>
      )}
    </>
  )
}

export default Mypage
