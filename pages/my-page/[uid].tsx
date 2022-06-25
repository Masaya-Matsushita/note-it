import { Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { SendEmailTroubleModal } from 'components/SendEmailTroubleModal'
import {
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
} from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AiOutlineMail } from 'react-icons/ai'

const Mypage: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [barrier, setBarrier] = useState(true)

  const signout = async (): Promise<void> => {
    setLoading(true)
    await signOut(auth)
    setLoading(false)
    router.push('/login')
  }

  const handleSendEmail = async (): Promise<void> => {
    const user = auth.currentUser
    if (user) {
      console.log('hoge')
      auth.languageCode = 'ja'
      const actionCodeSettings = {
        url: 'https://note-it-five.vercel.app/mypage/' + user.uid,
      }
      await sendEmailVerification(user, actionCodeSettings)
      showNotification({
        title: '送信完了！',
        message: 'メールが届いていることをご確認ください。',
        autoClose: 10000,
        icon: <AiOutlineMail size={20} />,
        style: { padding: '15px' },
      })
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (
          user.providerData[0].providerId === 'password' &&
          user.emailVerified === false
        ) {
          // 未認証
          // 確認メール再送信 & ログアウト用のモーダルを作成し、認証後再ログインしてもらう
          console.log('ng')
          setBarrier(true)
        } else {
          // 認証済み
          // コンテンツのfetch＆表示
          console.log('ok')
        }
      }
    })
  }, [])

  return (
    <div>
      {barrier ? (
        <div>
          <div>メールアドレスが未認証です</div>
          <div>1.以下の「認証メールを送信」ボタンを押す。</div>
          <div>
            2.登録したメールアドレス宛に「認証メール」が届いていることを確認。
          </div>
          <div>
            3.メール本文内のリンクをクリックすることで認証が完了します。
          </div>
          <div>
            4.このページをリロードするか、以下の「ログイン画面へ」ボタンからログインし直してください。
          </div>
          <Button onClick={handleSendEmail}>認証メールを送信</Button>
          <Button onClick={signout} loading={loading}>
            ログイン画面へ
          </Button>
          <SendEmailTroubleModal />
        </div>
      ) : (
        <div>
          <div>{router.query.uid}</div>
          <Button onClick={signout} loading={loading}>
            サインアウト
          </Button>
        </div>
      )}
    </div>
  )
}

export default Mypage
