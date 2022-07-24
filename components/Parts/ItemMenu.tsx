import { Menu } from '@mantine/core'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { Pencil, Trash } from 'tabler-icons-react'
import { Book } from 'types'

type Props = {
  label: string
  targetBook: Book
  uid: string
  bookId: string
}

export const ItemMenu: FC<Props> = ({ label, targetBook, uid, bookId }) => {
  const router = useRouter()

  // ブラウザにtargetBookを保存し、book-formページへ
  const toEditPage = () => {
    sessionStorage.setItem('targetBook', JSON.stringify(targetBook))
    router.push({
      pathname: `/my-page/${uid}/book-form`,
      query: { id: bookId },
    })
  }

  return (
    <Menu
      control={<div>...</div>}
      classNames={{
        root: 'w-12 text-center h-14 text-dark-400 md:text-4xl text-2xl mr-4',
        body: 'border-dark-500 border-solid',
      }}
    >
      <Menu.Label>{label}</Menu.Label>
      <Menu.Item icon={<Pencil size={14} />} onClick={() => toEditPage()}>
        編集
      </Menu.Item>
      <Menu.Item color='red' icon={<Trash size={14} />}>
        削除
      </Menu.Item>
    </Menu>
  )
}
