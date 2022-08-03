import { Menu } from '@mantine/core'
import { Dispatch, FC, memo } from 'react'
import { Pencil, Trash } from 'tabler-icons-react'
import { ConfirmDialog } from './ConfirmDialog'

type Props = {
  label: string
  toEditPage: () => void
  handleDelete: () => void
  openDialog: boolean
  dispatch: Dispatch<any>
  badgeId?: string
  bookId?: string
  noteId?: string
}

// eslint-disable-next-line react/display-name
export const ItemMenu: FC<Props> = memo(
  ({
    label,
    toEditPage,
    handleDelete,
    openDialog,
    dispatch,
    badgeId,
    bookId,
    noteId,
  }) => {
    const handleClose = () => {
      dispatch({ type: 'openDialog', openDialog: false })
    }

    // sessionStorageに削除対象のidを保存
    const setDeleteItem = () => {
      if (noteId) {
        sessionStorage.setItem('deleteTarget', noteId)
      } else {
        sessionStorage.setItem(
          'deleteTarget',
          JSON.stringify({ badgeId: badgeId, bookId: bookId })
        )
      }
      dispatch({ type: 'openDialog', openDialog: true })
    }
    
    return (
      <div>
        <ConfirmDialog
          openDialog={openDialog}
          handleClose={handleClose}
          handleConfirm={handleDelete}
        >
          <div className='mt-4 mb-8 text-center'>
            削除してもよろしいですか？
          </div>
        </ConfirmDialog>
        <Menu
          control={<div>...</div>}
          classNames={{
            root: 'w-12 text-center h-14 text-dark-400 md:text-3xl text-2xl mr-4',
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
            onClick={setDeleteItem}
          >
            削除
          </Menu.Item>
        </Menu>
      </div>
    )
  }
)
