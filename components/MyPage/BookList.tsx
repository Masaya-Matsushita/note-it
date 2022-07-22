import { Accordion } from '@mantine/core'
import { ItemMenu } from 'components/Parts/ItemMenu'
import { auth } from 'firebaseConfig/firebase'
import { NextRouter } from 'next/router'
import { FC } from 'react'
import { Book2 } from 'tabler-icons-react'
import { Book, BadgeAndBooksList } from 'types'

type Props = {
  badgeAndBooksList: BadgeAndBooksList
  router: NextRouter
}

export const BookList: FC<Props> = ({ badgeAndBooksList, router }) => {
  // typeId,bookIdを保存し、bookページへ
  const toBookPage = (targetBook: Book) => {
    const user = auth.currentUser
    if (user) {
      sessionStorage.setItem('targetBook', JSON.stringify(targetBook))
      router.push(`/my-page/${user.uid}/${targetBook.bookId}`)
    }
  }

  return (
    <div className='min-h-screen'>
      <div className='mt-6 text-3xl'>My Books</div>
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
                          const targetBook = {
                            badge: badgeAndBooks.badge,
                            bookId: book.id,
                            title: book.title,
                            overview: book.overview,
                          }
                          toBookPage(targetBook)
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
                      />
                    </div>
                  )
                })}
              </Accordion.Item>
            </Accordion>
          )
        })
      ) : (
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
      )}
    </div>
  )
}
