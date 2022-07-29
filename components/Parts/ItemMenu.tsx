import { Menu } from '@mantine/core'
import { BookListAction } from 'pages/my-page/[uid]'
import { Dispatch, FC, memo } from 'react'
import { Pencil, Trash } from 'tabler-icons-react'
import { ConfirmDialog } from './ConfirmDialog'

type Props = {
  label: string
  toEditPage: any
  handleDelete: any
  openDialog: boolean
  dispatch: Dispatch<BookListAction>
}

// eslint-disable-next-line react/display-name
export const ItemMenu: FC<Props> = memo(
  ({ label, toEditPage, handleDelete, openDialog, dispatch }) => {
    return (
      <div>
        <ConfirmDialog
          label='削除してもよろしいですか？'
          openDialog={openDialog}
          dispatch={dispatch}
          handleConfirm={handleDelete}
        />
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
            onClick={() => dispatch({ type: 'openDialog', openDialog: true })}
          >
            削除
          </Menu.Item>
        </Menu>
      </div>
    )
  }
)
