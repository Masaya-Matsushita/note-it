import { FC, memo, useCallback, useEffect, useState } from 'react'
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { Modal } from '@mantine/core'
import { BiHelpCircle } from 'react-icons/bi'
import { showNotification } from '@mantine/notifications'
import { AiOutlineMail } from 'react-icons/ai'
import { ResendButton } from './ResendButton'

type Props = { resendButton: boolean }

const ITEMS = [
  '迷惑メールフォルダに振り分けされてしまっている',
  '入力したメールアドレスが間違っている',
  '受信トレイの空き容量が不足している',
  'インターネット接続が不安定である',
]

// eslint-disable-next-line react/display-name
export const SendEmailTroubleModal: FC<Props> = memo(({ resendButton }) => {
  const [opened, setOpened] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  // userに確認メールを送信
  const handleSendEmail = useCallback(async () => {
    try {
      const user = auth.currentUser
      if (user) {
        auth.languageCode = 'ja'
        await sendEmailVerification(user)
        setOpenDialog(false)
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
      setError(error.code)
    }
  }, [])

  // マウント時、ユーザーのemailを取得
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setEmail(user.email)
      }
    })
  }, [])

  // errorを初期値に戻す＆モーダルを閉じる
  const handleClose = useCallback(() => {
    setOpenDialog(false)
    setError('')
  }, [])

  return (
    <div className='flex justify-end items-center mt-6 xs:mt-4'>
      <BiHelpCircle />
      <span
        className='text-base underline hover:cursor-pointer'
        onClick={() => setOpened(true)}
      >
        メールが届かない場合
      </span>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton={false}
        className='mt-16'
      >
        <div className='mb-2 ml-2 text-xl'>主な考えられる原因</div>
        <div className='grow mb-2 border border-dark-400 border-solid'></div>
        <ol className='space-y-1'>
          {ITEMS.map((item) => {
            return <li key={item}>{item}</li>
          })}
        </ol>
        {/* 再送信ボタンの有無 */}
        <ResendButton
          resendButton={resendButton}
          error={error}
          email={email}
          openDialog={openDialog}
          switchModal={() => setOpenDialog(true)}
          handleClose={handleClose}
          handleSendEmail={handleSendEmail}
        />
      </Modal>
    </div>
  )
})
