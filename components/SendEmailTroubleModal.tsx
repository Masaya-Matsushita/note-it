import { Button, Modal } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { FC, useState } from 'react'
import { AiOutlineMail } from 'react-icons/ai'
import { BiHelpCircle } from 'react-icons/bi'

type Props = { resendButton: boolean }

export const SendEmailTroubleModal: FC<Props> = ({ resendButton }) => {
  const [opened, setOpened] = useState(false)

  const handleSendEmail = async (): Promise<void> => {
    const user = auth.currentUser
    if (user) {
      auth.languageCode = 'ja'
      await sendEmailVerification(user)
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
        メールが届かない場合
      </span>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton={false}
      >
        <div className='mb-2 ml-2 text-xl'>主な考えられる原因</div>
        <div className='grow mb-2 border border-dark-400 border-solid'></div>
        <ol className='space-y-1'>
          <li> 迷惑メールフォルダに振り分けされてしまっている</li>
          <li>入力したメールアドレスが間違っている</li>
          <li>受信トレイの空き容量が不足している</li>
          <li>インターネット接続が不安定である</li>
        </ol>
        {resendButton ? (
          <div>
            <div className='grow mt-16 mb-4 border border-dark-500 border-solid'></div>
            <div>
              上記で解決しない場合、認証メールを再送信することもできます。古いメールのリンクは無効になります。
            </div>
            <Button
              onClick={handleSendEmail}
              className='block px-6 mt-2 mr-2 ml-auto'
            >
              再送信
            </Button>
          </div>
        ) : (
          <div className='mt-8 text-right'>
            確認後、もう一度お試しください。
          </div>
        )}
      </Modal>
    </div>
  )
}
