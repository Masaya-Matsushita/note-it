import { Button, LoadingOverlay, Modal } from '@mantine/core'
import { ErrorModal } from 'components/ErrorModal'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import type { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ComponentProps, useEffect, useState } from 'react'

const Mypage: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')
  const [opened, setOpened] = useState(true)
  const [userImage, setUserImage] = useState('/UnknownIcon.png')

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

  // usersにuserのドキュメントを作成
  const createUserDoc = async () => {
    const user = auth.currentUser
    if (user) {
      const docSnap = await getDoc(doc(db, 'users', user.uid))
      if (docSnap.exists()) {
        return
      } else {
        console.log('no such document')
      }
    }
  }

  const changeUserImage: ComponentProps<'input'>['onChange'] = (e) => {
    if (e.target.files) {
      const file = e.target.files[0]
      if (!file) {
        return
      }
      // const blobPath = URL.createObjectURL(file)
      // setUserImage(blobPath)
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
      createUserDoc()
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
          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            closeOnClickOutside={false}
            closeOnEscape={false}
            title='Introduce yourself!'
          >
            <label htmlFor='userImage'>
              <input
                id='userImage'
                type='file'
                accept='image/*,.png,.jpg,.jpeg,.gif'
                onChange={(e) => changeUserImage(e)}
                className='hidden'
              />
              画像追加
            </label>
            <div className='relative w-32 h-32'>
              <Image
                src={userImage}
                alt='user'
                layout='fill'
                className='rounded-full border-white border-solid'
              />
            </div>
          </Modal>
          <ErrorModal error={error} setError={setError} />
          <Button onClick={logout} loading={loading}>
            サインアウト
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default Mypage
