import { Button } from '@mantine/core'
import { signOut } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    const user = auth.currentUser
    if (user) {
      if (
        user.providerData[0].providerId === 'password' &&
        user.emailVerified === false
      ) {
        // 未認証
        // 確認メール再送信 & ログアウト用のモーダルを作成し、認証後再ログインしてもらう
        setBarrier(true)
      } else {
        // 認証済み
        // コンテンツのfetch＆表示
      }
    }
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
          <Button>認証メールを送信</Button>
          <Button>ログイン画面へ</Button>
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
