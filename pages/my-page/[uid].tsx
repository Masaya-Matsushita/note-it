import { Button, Card, LoadingOverlay, Modal, TextInput } from '@mantine/core'
import { ErrorModal } from 'components/ErrorModal'
import { signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import db, { auth, storage } from 'firebaseConfig/firebase'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ComponentProps, useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'

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

  // アイコンをアップロード＆URLを取得して表示
  const changeUserImage: ComponentProps<'input'>['onChange'] = async (e) => {
    if (!e.target.files) {
      return
    }
    const file = e.target.files[0]
    const user = auth.currentUser
    const iconUsersRef = ref(storage, `users/${user?.uid}/icon`)
    try {
      await uploadBytes(iconUsersRef, file)
      const iconUrl = await getDownloadURL(iconUsersRef)
      setUserImage(iconUrl)
    } catch (error) {
      console.error('error', error)
    }
  }

  // userのドキュメントを作成する
  const setUserProfile = async () => {
    const user = auth.currentUser
    if (user) {
      await setDoc(doc(db, 'users', user.uid), {
        iconURL: userImage,
      })
    }
    setOpened(false)
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
            <div className='text-lg text-center'>
              アイコンと名前を設定してください。
            </div>
            <div className='mb-4 text-center'>あとからでも変更できます。</div>
            <Card className='flex justify-around'>
              <div className='relative'>
                <img
                  src={userImage}
                  alt='icon'
                  className='w-20 h-20 rounded-full sm:w-24 sm:h-24'
                />
                <label
                  htmlFor='userImage'
                  className='absolute -top-1 left-14 sm:left-16'
                >
                  <input
                    id='userImage'
                    type='file'
                    accept='image/*,.png,.jpg,.jpeg,.gif'
                    onChange={(e) => changeUserImage(e)}
                    className='hidden'
                  />
                  <div className='flex justify-center items-center w-6 h-6 bg-blue-500 rounded-full'>
                    <AiOutlinePlus />
                  </div>
                </label>
              </div>
              <TextInput label='Name' required className='mt-1 max-w-48' />
            </Card>
            <Button onClick={setUserProfile} className='block mt-8 ml-auto'>
              完了
            </Button>
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
