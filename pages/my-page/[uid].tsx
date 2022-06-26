import { Button } from '@mantine/core'
import { signOut } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Mypage: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

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
        console.log('ng')
        console.log(user)
        router.push('/no-verified')
      } else {
        // 認証済み
        // コンテンツのfetch＆表示
        console.log('ok')
      }
    }
  }, [])

  return (
    <div>
      <div>{router.query.uid}</div>
      <Button onClick={signout} loading={loading}>
        サインアウト
      </Button>
    </div>
  )
}

export default Mypage
