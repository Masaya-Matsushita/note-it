import { Button, Modal } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { useState } from 'react'
import { AiOutlineMail } from 'react-icons/ai'
import { BiHelpCircle } from 'react-icons/bi'

export const ResendVerifyEmailModal = (): JSX.Element => {
  const [opened, setOpened] = useState(false)
  const [error, setError] = useState('')

  // userに確認メールを送信
  const handleSendEmail = async (): Promise<void> => {
    try {
      const user = auth.currentUser
      if (user) {
        auth.languageCode = 'ja'
        await sendEmailVerification(user)
        setOpened(false)
        showNotification({
          title: '認証メールを送信しました！',
          message: 'メールフォルダをご確認ください',
          autoClose: 10000,
          icon: <AiOutlineMail size={20} />,
          style: { padding: '15px' },
        })
      }
    } catch (error: any) {
      console.error(error.code)
      setError(error.code)
    }
  }

  // errorを初期値に戻す＆モーダルを閉じる
  const handleClose = () => {
    setOpened(false)
    setError('')
  }

  return (
    <div>
      <div className='flex justify-end items-center mt-4'>
        <BiHelpCircle />
        <span
          className='text-base underline hover:cursor-pointer'
          onClick={() => setOpened(true)}
        >
          リンクが期限切れの場合
        </span>
        <Modal opened={opened} onClose={handleClose} withCloseButton={false}>
          <div>
            <div className='mb-2 ml-2 text-xl'>リンクが期限切れの場合</div>
            <div className='grow mb-6 border border-dark-400 border-solid'></div>
            <div>こちらから認証メールを再送信できます。</div>
            {error !== '' ? (
              <div className='mt-2 text-sm font-bold text-red-500'>
                エラーが発生しました。しばらく時間をおいてお試しください。
              </div>
            ) : null}
            <Button
              onClick={handleSendEmail}
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
