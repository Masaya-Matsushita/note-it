import { Accordion, Card } from '@mantine/core'
import { auth } from 'firebaseConfig/firebase'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { Book, BadgeAndBooksList } from 'types'

type Props = {
  badgeAndBooksList: BadgeAndBooksList
}

export const BookList: FC<Props> = ({ badgeAndBooksList }) => {
  const router = useRouter()

  // typeId,bookIdを保存し、booksページへ
  const toBooksPage = (targetBook: Book) => {
    const user = auth.currentUser
    if (user) {
      sessionStorage.setItem('targetBook', JSON.stringify(targetBook))
      router.push(`/my-page/${user.uid}/books/${targetBook.bookId}`)
    }
  }

  return (
    <div>
      <div className='text-3xl'>My Books</div>
      <div className='grow my-2 border border-dark-400 border-solid'></div>
      {badgeAndBooksList.length ? (
        badgeAndBooksList.map((badgeAndBooks) => {
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
              key={badgeAndBooks.badge.id}
            >
              <Accordion.Item label={badgeAndBooks.badge.badge}>
                {badgeAndBooks.books.map((book) => {
                  return (
                    <Card
                      className='p-4 mt-4 hover:bg-dark-600 hover:cursor-pointer'
                      key={book.id}
                      onClick={() => {
                        const targetBook = {
                          badgeId: badgeAndBooks.badge.id,
                          badge: badgeAndBooks.badge.badge,
                          bookId: book.id,
                          title: book.title,
                          overview: book.overview,
                        }
                        toBooksPage(targetBook)
                      }}
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
    </div>
  )
}
