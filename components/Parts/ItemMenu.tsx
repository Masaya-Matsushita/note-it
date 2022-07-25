import { Menu } from '@mantine/core'
import { FC } from 'react'
import { Pencil, Trash } from 'tabler-icons-react'

type Props = {
  label: string
  toEditPage: any
  handleDelete: any
}

export const ItemMenu: FC<Props> = ({ label, toEditPage, handleDelete }) => {
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
      <Menu.Item
        color='red'
        icon={<Trash size={14} />}
        onClick={() => handleDelete()}
      >
        削除
      </Menu.Item>
    </Menu>
  )
}
