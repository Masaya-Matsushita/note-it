import { Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { SendEmailTroubleModal } from 'components/SendEmailTroubleModal'
import { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

const NoVerified: NextPage = () => {
  const router = useRouter()

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
      <Button onClick={toMyPage}>マイページへ</Button>
      <SendEmailTroubleModal resendButton={true} />
    </div>
  )
}

export default NoVerified
