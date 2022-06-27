import { Button, LoadingOverlay } from '@mantine/core'
import { ErrorModal } from 'components/ErrorModal'
import { signOut } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Mypage: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')

  // ログアウト処理
  const logout = async (): Promise<void> => {
    try {
      setLoading(true)
      await signOut(auth)
      setLoading(false)
      router.push('/login')
    } catch (error: any) {
      setError(error.code)
    }
  }

  useEffect(() => {
    const user = auth.currentUser
    // パスワードログインかつメール未認証のとき、no-verifiedページへ
    if (
      user?.providerData[0].providerId === 'password' &&
      user?.emailVerified === false
    ) {
      router.push('/no-verified')
    } else {
      setPageLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!pageLoading) {
      setVisible(true)
    }
  }, [pageLoading])

  return (
    <div>
      <LoadingOverlay visible={pageLoading} loaderProps={{ size: 'xl' }} />
      {/* ユーザーが未認証の時は表示されない */}
      {visible ? (
        <div>
          <ErrorModal error={error} setError={setError} />
          <div>{router.query.uid}</div>
          <Button onClick={logout} loading={loading}>
            サインアウト
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default Mypage
