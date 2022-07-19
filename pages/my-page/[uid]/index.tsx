import { ErrorModal } from 'components/Modal/ErrorModal'
import { UserProfileModal } from 'components/Modal/UserProfileModal'
import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { Accordion, Button, Card, LoadingOverlay } from '@mantine/core'
import { Plus } from 'tabler-icons-react'

type Types = '学校' | '試験' | '研究' | '資格' | '研鑽' | '教養' | '趣味' | 'その他'

type DataList = {
  types: { id: string; type: Types }
  books: { id: string; title: string; overview: string }[]
}[]

type Books = { id: string; title: string; overview: string }[]

const Mypage: NextPage = () => {
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [opened, setOpened] = useState(false)
  const [dataList, setDataList] = useState<DataList>([])

  // userのドキュメントが存在するか判断
  const checkUserExists = async () => {
    const user = auth.currentUser
    if (user) {
      const userSnap = await getDoc(doc(db, 'users', user.uid))
      if (userSnap.exists()) {
        createDataList()
      } else {
        setOpened(true)
      }
    }
  }

  // typesとbooksを取得しdataListへ追加
  const createDataList = async () => {
    setDataList([])
    const user = auth.currentUser
    if (user) {
      // userのtypesを取得
      const typesSnap = await getDocs(
        collection(db, 'users', user.uid, 'types')
      )
      // 各typesのbooksを取得
      typesSnap.forEach(async (type) => {
        const booksSnap = await getDocs(
          collection(db, 'users', user.uid, 'types', type.id, 'books')
        )
        let books: Books = []
        booksSnap.forEach((book) => {
          books.push({
            id: book.id,
            title: book.data().title,
            overview: book.data().overview,
          })
        })
        // typesとbooksを整形してdataListへ追加
        setDataList((prev) => {
          return [
            ...prev,
            { types: { id: type.id, type: type.data().type }, books: books },
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
