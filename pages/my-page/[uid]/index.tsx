import { UserProfileModal } from 'components/Modal/UserProfileModal'
import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { Loader } from '@mantine/core'
import { BookList } from 'components/MyPage/BookList'
import { Books, BadgeAndBooksList } from 'types'
import { ToCreateBookButton } from 'components/MyPage/ToCreateBookButton'

const Mypage: NextPage = () => {
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)
  const [opened, setOpened] = useState(false)
  const [badgeAndBooksList, setBadgeAndBooksList] = useState<
    BadgeAndBooksList | undefined
  >()

  // userのドキュメントが存在するか判断
  const checkUserExists = async () => {
    const user = auth.currentUser
    if (user) {
      const userSnap = await getDoc(doc(db, 'users', user.uid))
      if (userSnap.exists()) {
        createBadgeAndBooksList()
      } else {
        setOpened(true)
      }
    }
  }

  // badgesとbooksを取得しbadgeAndBooksListへ追加
  const createBadgeAndBooksList = async () => {
    const user = auth.currentUser
    if (user) {
      // userのbadgesを取得
      const badgesSnap = await getDocs(
        collection(db, 'users', user.uid, 'badges')
      )
      let badgeAndBooksArray: BadgeAndBooksList = []
      // 各badgeのbooksを取得
      badgesSnap.forEach(async (badge) => {
        const booksSnap = await getDocs(
          collection(
            db,
            'users',
            user.uid,
            'badges',
            badge.data().badge,
            'books'
          )
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
          setBadgeAndBooksList(badgeAndBooksArray)
        } else {
          setBadgeAndBooksList([])
        }
      })
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // パスワードログインかつメール未認証のとき、no-verifiedページへ
      if (
        user?.providerData[0].providerId === 'password' &&
        user?.emailVerified === false
      ) {
        router.push('/no-verified')
      } else {
        checkUserExists()
        setPageLoading(false)
      }
    })
  }, [])

  return (
    <>
      {/* ユーザーが未認証の時は表示されない */}
      {pageLoading ? (
        <Loader size='xl' className='fixed inset-0 m-auto' />
      ) : (
        <>
          <UserProfileModal opened={opened} setOpened={setOpened} />
          <BookList badgeAndBooksList={badgeAndBooksList} router={router} />
          <ToCreateBookButton router={router} />
        </>
      )}
    </>
  )
}

export default Mypage
