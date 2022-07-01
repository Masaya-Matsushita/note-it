import { Button, Card, Modal, TextInput } from '@mantine/core'
import { doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import db, { auth, storage } from 'firebaseConfig/firebase'
import {
  ComponentProps,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { Plus } from 'tabler-icons-react'

type Props = {
  opened: boolean
  setOpened: Dispatch<SetStateAction<boolean>>
}

export const UserProfileModal: FC<Props> = ({ opened, setOpened }) => {
  const [error, setError] = useState('')
  const [userIcon, setUserIcon] = useState('/UnknownIcon.png')
  const [userName, setUserName] = useState('')

  // ユーザーネームを入力
  const changeUserName: ComponentProps<'input'>['onChange'] = (e) => {
    setUserName(e.target.value)
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
      setUserIcon(iconUrl)
    } catch (error: any) {
      setError(error.message)
    }
  }

  // userのドキュメントを作成する
  const createUserProfile = async () => {
    const user = auth.currentUser
    if (user) {
      await setDoc(doc(db, 'users', user.uid), {
        userName: userName,
        iconURL: userIcon,
      })
    }
    setOpened(false)
  }

  useEffect(() => {
    const user = auth.currentUser
    if (typeof user?.displayName === 'string') {
      setUserName(user?.displayName)
    }
  }, [])

  return (
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
      <Card className='flex flex-col items-center mx-16'>
        <div className='relative'>
          <img
            src={userIcon}
            alt='icon'
            className='w-20 h-20 rounded-full sm:w-24 sm:h-24'
          />
          <label htmlFor='userIcon' className='absolute left-14 sm:left-16'>
            <input
              id='userIcon'
              type='file'
              accept='image/*,.png,.jpg,.jpeg,.gif'
              onChange={(e) => changeUserImage(e)}
              className='hidden'
            />
            <div className='flex justify-center items-center w-6 h-6 bg-blue-500 rounded-full sm:w-8 sm:h-8'>
              <Plus size={20} strokeWidth={3} color={'white'} />
            </div>
          </label>
        </div>
        <TextInput
          placeholder='User Name'
          required
          value={userName}
          onChange={(e) => changeUserName(e)}
          className='mt-4'
        />
      </Card>
      {error !== '' ? (
        <div className='mt-2 text-sm font-bold text-red-500'>
          エラーが発生しました。入力内容をご確認ください。(画像サイズは最大5MBです)
        </div>
      ) : null}
      <Button onClick={createUserProfile} className='block mx-auto mt-8 w-48'>
        完了
      </Button>
    </Modal>
  )
}
