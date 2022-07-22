import { Accordion, Menu } from '@mantine/core'
import { auth } from 'firebaseConfig/firebase'
import { NextRouter } from 'next/router'
import { FC } from 'react'
import { Pencil, Trash } from 'tabler-icons-react'
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
                      <Menu
                        control={<div>...</div>}
                        classNames={{
                          root: 'w-12 text-center h-14 text-dark-400 text-4xl mr-4',
                        }}
                      >
                        <Menu.Label>
                          {book.title.length > 20
                            ? book.title.slice(0, 20) + '...'
                            : book.title}
                        </Menu.Label>
                        <Menu.Item icon={<Pencil size={14} />}>編集</Menu.Item>
                        <Menu.Item color='red' icon={<Trash size={14} />}>
                          削除
                        </Menu.Item>
                      </Menu>
                    </div>
                  )
                })}
              </Accordion.Item>
            </Accordion>
          )
        })
      ) : (
        <div>
          <div className='mt-4 text-center'>Booksがありません。</div>
          <div className='mt-2 text-center'>右下のボタンから新規作成。</div>
        </div>
      )}
    </div>
  )
}
