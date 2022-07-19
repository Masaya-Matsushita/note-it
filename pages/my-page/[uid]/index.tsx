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

const Mypage: NextPage = () => {
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [opened, setOpened] = useState(false)
  const [dataList, setDataList] = useState<
    {
      types: { id: string; type: string }
      books: { id: string; title: string; overview: string }[]
    }[]
  >([])

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
        let books: { id: string; title: string; overview: string }[] = []
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

  // typeId,bookIdを保存し、booksページへ
  const toBooksPage = (
    typeId: string,
    type: string,
    bookId: string,
    title: string,
    overview: string
  ) => {
    const user = auth.currentUser
    if (user) {
      const bookData = {
        typeId: typeId,
        type: type,
        bookId: bookId,
        title: title,
        overview: overview,
      }
      sessionStorage.setItem('bookData', JSON.stringify(bookData))
      router.push(`/my-page/${user.uid}/books/${bookId}`)
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
          <div className='text-3xl'>My Books</div>
          <div className='grow my-2 border border-dark-400 border-solid'></div>
          {dataList.length ? (
            dataList.map((data) => {
              return (
                <Accordion
                  offsetIcon={false}
                  disableIconRotation
                  multiple
                  initialItem={0}
                  classNames={{
                    // icon: 'text-red-500',
                    // label: 'text-red-500',
                    itemTitle: 'h-10',
                    contentInner: 'pt-0',
                    control: 'hover:bg-dark-800',
                  }}
                  key={data.types.id}
                >
                  <Accordion.Item label={data.types.type}>
                    {data.books.map((book) => {
                      return (
                        <Card
                          className='p-4 mt-4'
                          key={book.id}
                          onClick={() =>
                            toBooksPage(
                              data.types.id,
                              data.types.type,
                              book.id,
                              book.title,
                              book.overview
                            )
                          }
                        >
                          <div className='text-lg md:ml-2 md:text-xl'>
                            {book.title}
                          </div>
                        </Card>
                      )
                    })}
                  </Accordion.Item>
                </Accordion>
              )
            })
          ) : (
            <div>
              <div className='mt-4 text-center'>データがありません</div>
              <div className='mt-2 text-center'>右下のボタンから新規作成</div>
            </div>
          )}
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
