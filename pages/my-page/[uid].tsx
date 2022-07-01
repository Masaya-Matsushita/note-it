import { LoadingOverlay } from '@mantine/core'
import { ErrorModal } from 'components/ErrorModal'
import { UserProfileModal } from 'components/UserProfileModal'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Mypage: NextPage = () => {
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [opened, setOpened] = useState(false)

  // userのドキュメントが存在しなければ作成させる
  const checkUserExists = async () => {
    const user = auth.currentUser
    if (user) {
      const docSnap = await getDoc(doc(db, 'users', user.uid))
      if (docSnap.exists()) {
        return
      } else {
        setOpened(true)
      }
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // パスワードログインかつメール未認証のとき、no-verifiedページへ
      if (
        user?.providerData[0].providerId === 'password' &&
        user?.emailVerified === false
      ) {
        router.push('/no-verified')
      } else {
        checkUserExists()
        setPageLoading(false)
      }
    })
  }, [])

  return (
    <div>
      {/* ユーザーが未認証の時は表示されない */}
      {pageLoading ? (
        <LoadingOverlay visible={pageLoading} loaderProps={{ size: 'xl' }} />
      ) : (
        <div>
          <ErrorModal error={error} setError={setError} />
          <UserProfileModal opened={opened} setOpened={setOpened} />
        </div>
      )}
    </div>
  )
}

export default Mypage
