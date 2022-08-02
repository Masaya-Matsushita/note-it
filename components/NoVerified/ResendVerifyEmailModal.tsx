import { useEffect, useState } from 'react'
import { auth } from 'firebaseConfig/firebase'
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth'
import { Button, Modal, Space } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { AiOutlineMail } from 'react-icons/ai'
import { BiHelpCircle } from 'react-icons/bi'
import { ConfirmDialog } from 'components/Parts/ConfirmDialog'

export const ResendVerifyEmailModal = (): JSX.Element => {
  const [opened, setOpened] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  // userに確認メールを送信
  const handleSendEmail = async (): Promise<void> => {
    try {
      const user = auth.currentUser
      if (user) {
        auth.languageCode = 'ja'
        await sendEmailVerification(user)
        setOpenDialog(false)
        showNotification({
          title: '認証メールを送信しました！',
          message: 'メールフォルダをご確認ください',
          autoClose: 10000,
          icon: <AiOutlineMail size={20} />,
          style: { padding: '15px' },
        })
      }
    } catch (error: any) {
      setError(error.code)
    }
  }

  // マウント時、ユーザーのemailを取得
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setEmail(user.email)
      }
    })
  }, [])

  // errorを初期値に戻す＆モーダルを閉じる
  const handleClose = () => {
    setOpenDialog(false)
    setError('')
  }

  // モーダルの切り替え
  const switchModal = () => {
    setOpened(false)
    setOpenDialog(true)
  }

  return (
    <div>
      <div className='flex justify-end items-center mt-4'>
        <BiHelpCircle />
        <span
          className='underline hover:cursor-pointer'
          onClick={() => setOpened(true)}
        >
          リンクが期限切れの場合
        </span>
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
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          withCloseButton={false}
          className='mt-16'
        >
          <div>
            <div className='mb-2 ml-2 text-xl'>リンクが期限切れの場合</div>
            <div className='grow mb-6 border border-dark-400 border-solid'></div>
            <div>こちらから認証メールを再送信できます。</div>
            <Button
              onClick={switchModal}
              className='block px-6 mt-3 mr-4 ml-auto'
            >
              再送信
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  )
}
