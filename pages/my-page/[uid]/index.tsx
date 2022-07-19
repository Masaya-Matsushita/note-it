import { ErrorModal } from 'components/Modal/ErrorModal'
import { UserProfileModal } from 'components/Modal/UserProfileModal'
import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { Button, LoadingOverlay } from '@mantine/core'
import { Plus } from 'tabler-icons-react'
import { BookList } from 'components/MyPage/BookList'
import { Books, BadgeAndBooksList } from 'types'

const Mypage: NextPage = () => {
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [opened, setOpened] = useState(false)
  const [badgeAndBooksList, setBadgeAndBooksList] = useState<BadgeAndBooksList>([])

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

  // typesとbooksを取得しdataListへ追加
  const createBadgeAndBooksList = async () => {
    setBadgeAndBooksList([])
    const user = auth.currentUser
    if (user) {
      // userのbadgesを取得
      const badgesSnap = await getDocs(
        collection(db, 'users', user.uid, 'badges')
      )
      // 各badgesのbooksを取得
      badgesSnap.forEach(async (badge) => {
        const booksSnap = await getDocs(
          collection(db, 'users', user.uid, 'badges', badge.id, 'books')
        )
        let books: Books = []
        booksSnap.forEach((book) => {
          books.push({
            id: book.id,
            title: book.data().title,
            overview: book.data().overview,
          })
        })
        // badgesとbooksを整形してdataListへ追加
        setBadgeAndBooksList((prev) => {
          return [
            ...prev,
            { badge: { id: badge.id, badge: badge.data().badge }, books: books },
          ]
        })
      })
      setPageLoading(false)
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
      }
    })
  }, [])

  return (
    <div>
      {/* ユーザーが未認証の時は表示されない */}
      {pageLoading ? (
        <LoadingOverlay visible={pageLoading} loaderProps={{ size: 'xl' }} />
      ) : (
        <div className='min-h-screen'>
          <ErrorModal error={error} setError={setError} />
          <UserProfileModal opened={opened} setOpened={setOpened} />
          <BookList badgeAndBooksList={badgeAndBooksList} />
          <Button
            className='sticky bottom-0 left-full mr-2 w-16 h-16 rounded-full'
            compact
            onClick={() => console.log('hello')}
          >
            <Plus size={48} />
          </Button>
        </div>
      )}
    </div>
  )
}

export default Mypage
