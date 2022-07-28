import { Accordion, Loader } from '@mantine/core'
import { ItemMenu } from 'components/Parts/ItemMenu'
import { deleteDoc, doc } from 'firebase/firestore'
import db from 'firebaseConfig/firebase'
import { useSetItemAndRouter } from 'hooks/useSetItemAndRouter'
import { useRouter } from 'next/router'
import { FC, memo, useCallback } from 'react'
import { Book2 } from 'tabler-icons-react'
import { BadgeAndBooksList, Book } from 'types'

type Props = {
  badgeAndBooksList: BadgeAndBooksList | undefined
}

// eslint-disable-next-line react/display-name
export const BookList: FC<Props> = memo(({ badgeAndBooksList }) => {
  const router = useRouter()
  const uid = String(router.query.uid)
  const { setBookAndTransition } = useSetItemAndRouter()

  // targetBookをブラウザに保存し、bookページへ
  const toBookPage = useCallback(
    (book: Book, badgeId: string, bookId: string) => {
      setBookAndTransition(
        JSON.stringify(book),
        `/my-page/${uid}/${badgeId}/${bookId}`
      )
    },
    [setBookAndTransition, uid]
  )

  // ブラウザにtargetBookを保存し、book-formページへ
  const toEditPage = useCallback(
    (currentBook: Book, targetId: string) => {
      sessionStorage.setItem('currentBook', JSON.stringify(currentBook))
      router.push({
        pathname: `/my-page/${uid}/book-form`,
        query: { id: targetId },
      })
    },
    [router, uid]
  )

  // bookを削除
  const handleDelete = useCallback(
    async (badgeId: string, bookId: string) => {
      await deleteDoc(doc(db, 'users', uid, 'badges', badgeId, 'books', bookId))
      location.reload()
    },
    [uid]
  )

  // ローディング中
  if (!badgeAndBooksList) {
    return <Loader size='xl' className='fixed inset-0 m-auto' />
  }

  // 取得したデータが空だった場合
  if (badgeAndBooksList.length === 0) {
    return (
      <div className='mt-8 xs:flex xs:justify-center xs:items-center xs:mt-16'>
        <Book2
          size={'160px'}
          strokeWidth={1.5}
          color={'#2b2c31'}
          className='block mx-auto xs:mr-4 xs:ml-0'
        />
        <div className='text-lg text-center text-dark-400 xs:ml-4 xs:text-xl xs:text-left'>
          <div>Bookがありません。</div>
          <div>右下のボタンから新規作成。</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {badgeAndBooksList.map((badgeAndBooks) => {
        return (
          <Accordion
            offsetIcon={innerWidth < 700 ? false : true}
            disableIconRotation
            multiple
            initialItem={0}
            classNames={{
              itemTitle: 'h-10',
              contentInner: 'pt-0',
              control: 'hover:bg-dark-800',
            }}
            key={badgeAndBooks.badge}
          >
            <Accordion.Item label={badgeAndBooks.badge}>
              {badgeAndBooks.books.map((book) => {
                return (
                  <div
                    key={book.id}
                    className='flex justify-between items-start mt-4 bg-dark-700 hover:bg-dark-600 rounded-lg hover:cursor-pointer'
                  >
                    <div
                      className='flex-1 p-4 text-lg md:ml-2 md:text-xl'
                      onClick={() => {
                        toBookPage(
                          {
                            badge: badgeAndBooks.badge,
                            title: book.title,
                            overview: book.overview,
                          },
                          String(badgeAndBooks.priority),
                          book.id
                        )
                      }}
                    >
                      {book.title}
                    </div>
                    <ItemMenu
                      label={
                        book.title.length > 20
                          ? book.title.slice(0, 20) + '...'
                          : book.title
                      }
                      toEditPage={() =>
                        toEditPage(
                          {
                            badge: badgeAndBooks.badge,
                            title: book.title,
                            overview: book.overview,
                          },
                          book.id
                        )
                      }
                      handleDelete={() =>
                        handleDelete(String(badgeAndBooks.priority), book.id)
                      }
                    />
                  </div>
                )
              })}
            </Accordion.Item>
          </Accordion>
        )
      })}
    </div>
  )
})
