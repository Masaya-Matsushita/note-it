import { ComponentProps, Dispatch, FC, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import db, { auth, storage } from 'firebaseConfig/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { Button, Card, Modal, Skeleton, TextInput } from '@mantine/core'
import { Plus } from 'tabler-icons-react'
import { useRouter } from 'next/router'
import { useUserProfileModalState } from 'hooks/StateManagement/useUserProfileModalState'

type Props = {
  opened?: boolean
  propsDispatch: Dispatch<any>
}

export const UserProfileModal: FC<Props> = ({ opened, propsDispatch }) => {
  const router = useRouter()
  const uid = router.query.uid
  const { state, dispatch } = useUserProfileModalState()

  // アイコンをアップロード＆URLを取得して表示
  const changeUserImage: ComponentProps<'input'>['onChange'] = async (e) => {
    // fileが選択されてない場合
    if (!e.target.files) {
      return
    }
    const file = e.target.files[0]
    const iconUsersRef = ref(storage, `users/${uid}/icon`)
    try {
      await uploadBytes(iconUsersRef, file)
      const iconUrl = await getDownloadURL(iconUsersRef)
      dispatch({ type: 'icon', userIcon: iconUrl })
    } catch (error: any) {
      dispatch({ type: 'error', error: error.message })
    }
  }

  // userのドキュメントを作成/更新、リロード
  const setUserProfile = async () => {
    if (typeof uid === 'string' && state.userName) {
      await setDoc(doc(db, 'users', uid), {
        userName: state.userName,
        iconURL: state.userIcon,
      })
      propsDispatch({ type: 'opened', opened: false })
      location.reload()
    } else {
      dispatch({ type: 'error', error: 'username not entered' })
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, 'users', user.uid))
        if (docSnap.exists()) {
          // 更新の場合は現在のプロフィールを表示
          dispatch({
            type: 'display',
            userIcon: docSnap.data().iconURL,
            userName: docSnap.data().userName,
          })
        } else {
          // 新規作成の場合はデフォルトを表示
          dispatch({ type: 'icon', userIcon: '/UnknownIcon.png' })
          if (user.displayName) {
            dispatch({ type: 'name', userName: user.displayName })
          }
        }
      }
    })
  }, [])

  return (
    <Modal
      opened={opened ? opened : false}
      onClose={() => propsDispatch({ type: 'opened', opened: false })}
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      className='mx-2 mt-16'
    >
      <div className='mt-4 mb-6 text-xl text-center'>
        アイコンと名前を設定してください。
      </div>
      <Card className='flex flex-col items-center mx-16'>
        {state.userIcon ? (
          <div className='relative'>
            <img
              src={state.userIcon}
              alt='アイコンの描画に失敗しました。'
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
        ) : (
          <Skeleton className='w-20 h-20 rounded-full sm:w-24 sm:h-24' />
        )}
        <TextInput
          placeholder='User Name'
          value={state.userName}
          onChange={(e) =>
            dispatch({ type: 'name', userName: e.currentTarget.value })
          }
          className='mt-4'
        />
      </Card>
      {state.error ? (
        <div className='mt-2 text-sm font-bold text-center text-red-500'>
          {state.error === 'username not entered'
            ? 'ユーザーネームが未入力です。'
            : 'エラーが発生しました。入力内容をご確認ください。(画像サイズは最大5MBです'}
        </div>
      ) : null}
      <Button onClick={setUserProfile} className='block mx-auto mt-8 w-48'>
        完了
      </Button>
    </Modal>
  )
}
