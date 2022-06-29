import { Button, LoadingOverlay, Modal } from '@mantine/core'
import { ErrorModal } from 'components/ErrorModal'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import db, { auth, storage } from 'firebaseConfig/firebase'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ComponentProps, useEffect, useState } from 'react'
import { IoMdAddCircle } from 'react-icons/io'

const Mypage: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')
  const [opened, setOpened] = useState(false)
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

  // userのドキュメントが存在しなければ作成させる
  const createUserDoc = async () => {
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

  // アイコン画像をプレビュー
  const changeUserImage: ComponentProps<'input'>['onChange'] = (e) => {
    if (e.target.files) {
      const file = e.target.files[0]
      const blobPath = URL.createObjectURL(file)
      setUserImage(blobPath)
    } else {
      return
    }
  }

  // userのドキュメントを作成する
  const setUserProfile = () => {
    setOpened(false)
  }

  const test: ComponentProps<'input'>['onChange'] = async (e) => {
    if (e.target.files) {
      const user = auth.currentUser
      const iconUsersRef = ref(storage, `users/${user?.uid}/icon`)
      const file = e.target.files[0]
      try {
        await uploadBytes(iconUsersRef, file)
        const iconUrl = await getDownloadURL(iconUsersRef)
        setUserImage(iconUrl)
      } catch (error) {
        console.error('error', error)
      }
    } else {
      return
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
            withCloseButton={false}
          >
            <div>アイコンと名前を設定してください。</div>
            <div>あとからでも変更できます。</div>
            <div className='relative'>
              <img
                src={userImage}
                alt='user icon'
                className='w-24 h-24 rounded-full'
              />
              <label htmlFor='userImage' className='absolute -top-1 left-16'>
                <input
                  id='userImage'
                  type='file'
                  accept='image/*,.png,.jpg,.jpeg,.gif'
                  onChange={(e) => changeUserImage(e)}
                  className='hidden'
                />
                <IoMdAddCircle size={36} />
              </label>
            </div>
            <Button onClick={setUserProfile}>完了</Button>
          </Modal>
          <ErrorModal error={error} setError={setError} />
          <Button onClick={logout} loading={loading}>
            サインアウト
          </Button>
          <input
            type='file'
            accept='image/*,.png,.jpg,.jpeg,.gif'
            onChange={(e) => test(e)}
          />
          <img src={userImage} alt='icon' className='w-32 h-32' />
        </div>
      ) : null}
    </div>
  )
}

export default Mypage
