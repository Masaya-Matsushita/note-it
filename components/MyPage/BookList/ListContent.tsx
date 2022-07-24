import { Accordion, Loader } from '@mantine/core'
import { ItemMenu } from 'components/Parts/ItemMenu'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { Book2 } from 'tabler-icons-react'
import { BadgeAndBooksList, Book } from 'types'

type Props = {
  badgeAndBooksList: BadgeAndBooksList | undefined
}

export const ListContent: FC<Props> = ({ badgeAndBooksList }) => {
  const router = useRouter()
  const uid = router.query.uid

  // targetBookをブラウザに保存し、bookページへ
  const toBookPage = (targetBook: Book, bookId: string) => {
    if (typeof uid === 'string') {
      sessionStorage.setItem('targetBook', JSON.stringify(targetBook))
      router.push(`/my-page/${uid}/${bookId}`)
    }
  }

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
                        const targetBook = {
                          badge: badgeAndBooks.badge,
                          title: book.title,
                          overview: book.overview,
                        }
                        toBookPage(targetBook, book.id)
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
      })}
    </div>
  )
}
