import { Button, Modal } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { useState } from 'react'
import { AiOutlineMail } from 'react-icons/ai'
import { BiHelpCircle } from 'react-icons/bi'

export const ResendVerifyEmailModal = (): JSX.Element => {
  const [opened, setOpened] = useState(false)

  const handleSendEmail = async (): Promise<void> => {
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
  }

  return (
    <div className='flex justify-end items-center mt-6 xs:mt-4'>
      <BiHelpCircle />
      <span
        className='text-sm underline hover:cursor-pointer xs:text-base'
        onClick={() => setOpened(true)}
      >
        リンクが期限切れの場合
      </span>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton={false}
      >
        <div>
          <div className='mb-2 ml-2 text-xl'>リンクが期限切れの場合</div>
          <div className='grow mb-6 border border-dark-400 border-solid'></div>
          <div>こちらから認証メールを再送信できます。</div>
          <Button
            onClick={handleSendEmail}
            className='block px-6 mt-3 mr-4 ml-auto'
          >
            再送信
          </Button>
        </div>
      </Modal>
    </div>
  )
}
