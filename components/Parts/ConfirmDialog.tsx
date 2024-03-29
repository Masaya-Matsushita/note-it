import { Button, Modal } from '@mantine/core'
import { FC, memo, ReactNode } from 'react'

type Props = {
  children: ReactNode
  openDialog: boolean
  handleClose: () => void
  handleConfirm: () => void
}

// eslint-disable-next-line react/display-name
export const ConfirmDialog: FC<Props> = memo(
  ({ children, openDialog, handleClose, handleConfirm }) => {
    return (
      <Modal
        opened={openDialog}
        onClose={handleClose}
        withCloseButton={false}
        classNames={{
          modal: 'mt-20 w-60 border-dark-600 rounded-md sm:w-96 border-solid',
        }}
      >
        <div>{children}</div>
        <div className='flex items-center'>
          <Button color='red' onClick={handleClose} className='flex-1 mr-2'>
            Cansel
          </Button>
          <Button onClick={handleConfirm} className='flex-1 mr-2'>
            OK
          </Button>
        </div>
      </Modal>
    )
  }
)
