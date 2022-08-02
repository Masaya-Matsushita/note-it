import { Button, Space } from '@mantine/core'
import { FC, memo } from 'react'
import { ConfirmDialog } from '../ConfirmDialog'

type Props = {
  resendButton: boolean
  error: string
  email: string
  openDialog: boolean
  switchModal: () => void
  handleClose: () => void
  handleSendEmail: any
}

// eslint-disable-next-line react/display-name
export const ResendButton: FC<Props> = memo(
  ({
    resendButton,
    error,
    email,
    openDialog,
    switchModal,
    handleClose,
    handleSendEmail,
  }) => {
    if (!resendButton) {
      return (
        <div className='mt-8 text-right'>確認後、もう一度お試しください。</div>
      )
    }
    return (
      <div>
        <ConfirmDialog
          openDialog={openDialog}
          handleClose={handleClose}
          handleConfirm={handleSendEmail}
        >
          <div className='my-2 text-center text-dark-100'>
            こちらのメールアドレスに再送信。
          </div>
          <div className='p-2 text-center text-dark-200 bg-dark-1000 rounded-md xs:py-4 xs:mx-6'>
            {email}
          </div>
          {error !== '' ? (
            <div className='my-4 text-sm font-bold text-red-500'>
              エラーが発生しました。しばらく時間をおいてお試しください。
            </div>
          ) : (
            <Space h='xl' />
          )}
        </ConfirmDialog>
        <div className='grow mt-16 mb-4 border border-dark-500 border-solid'></div>
        <div>
          上記で解決しない場合、認証メールを再送信することもできます。（古いメールのリンクは無効になります）
        </div>
        <Button onClick={switchModal} className='block px-6 mt-2 mr-2 ml-auto'>
          再送信
        </Button>
      </div>
    )
  }
)
