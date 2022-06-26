import { Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { SendEmailTroubleModal } from 'components/SendEmailTroubleModal'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { AiOutlineMail } from 'react-icons/ai'

const NoVerified: NextPage = () => {
  const router = useRouter()

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

  const toMyPage = () => {
    // ボタンを押す度にuserを再定義し直したい
    // リロードすると再定義される
    const user = auth.currentUser
    if (user?.emailVerified === true) {
      router.push(`my-page/${user.uid}`)
    } else {
      console.log('未認証です！')
    }
  }

  return (
    <div>
      <div>メールアドレスが未認証です</div>
      <ol>
        <li>
          登録したメールアドレス宛に「認証メール」が届いていることを確認。
        </li>
        <li>メール本文内のリンクをクリックすることで認証が完了します。</li>
        <li>「マイページへ」ボタンからマイページへ移動してください。</li>
      </ol>
      <Button onClick={handleSendEmail}>認証メールを再送信</Button>
      <Button onClick={toMyPage}>マイページへ</Button>
      <SendEmailTroubleModal />
    </div>
  )
}

export default NoVerified
