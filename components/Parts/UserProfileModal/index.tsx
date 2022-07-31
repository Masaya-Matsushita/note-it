import { FC, memo, useCallback, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import db, { auth, storage } from 'firebaseConfig/firebase'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { Button, Card, Modal, TextInput } from '@mantine/core'
import { useRouter } from 'next/router'
import { Reducer, useReducer } from 'react'
import { TrimmingIcon } from './TrimmingIcon'

type Props = {
  opened: boolean
  handleClose: () => void
}

export type UserProfileIconState = typeof initialState

export type UserProfileIconAction = {
  type:
    | 'icon'
    | 'name'
    | 'error'
    | 'display'
    | 'openTrim'
    | 'closeTrim'
    | 'croppedImgSrc'
} & Partial<UserProfileIconState>

const initialState = {
  error: '',
  iconURL: '',
  userName: '',
  trimOpened: false,
  croppedImgSrc: '',
}

const reducer: Reducer<UserProfileIconState, UserProfileIconAction> = (
  state,
  action
) => {
  switch (action.type) {
    case 'icon': {
      return {
        ...state,
        iconURL: action.iconURL ?? '',
      }
    }
    case 'name': {
      return {
        ...state,
        userName: action.userName ?? '',
      }
    }
    case 'display': {
      return {
        ...state,
        iconURL: action.iconURL ?? '',
        userName: action.userName ?? '',
      }
    }
    case 'error': {
      return {
        ...state,
        error: action.error ?? '',
      }
    }
    case 'openTrim': {
      return {
        ...state,
        trimOpened: true,
      }
    }
    case 'closeTrim': {
      return {
        ...state,
        trimOpened: false,
      }
    }
    case 'croppedImgSrc': {
      return {
        ...state,
        croppedImgSrc: action.croppedImgSrc ?? '',
        trimOpened: false,
      }
    }
  }
}

// eslint-disable-next-line react/display-name
export const UserProfileModal: FC<Props> = memo(({ opened, handleClose }) => {
  const router = useRouter()
  const uid = String(router.query.uid)
  const [state, dispatch] = useReducer(reducer, initialState)

  // userのドキュメントを作成/更新
  const setUserProfile = useCallback(async () => {
    if (state.userName && state.userName.length <= 20) {
      // ユーザーネームのみ保存/更新する場合
      if (!state.croppedImgSrc) {
        await setDoc(doc(db, 'users', uid), {
          userName: state.userName,
          iconURL: state.iconURL,
        })
        location.reload()
        return
      }
      // Storageへアイコン画像(Base64)を保存
      const iconUsersRef = ref(storage, `users/${uid}/icon`)
      await uploadString(iconUsersRef, state.croppedImgSrc, 'data_url')
      // 保存した画像のパスを取得、ユーザーネームと共に保存
      const iconUrl = await getDownloadURL(iconUsersRef)
      await setDoc(doc(db, 'users', uid), {
        userName: state.userName,
        iconURL: iconUrl,
      })
      location.reload()
    } else {
      dispatch({ type: 'error', error: 'username error' })
    }
  }, [state.userName, state.croppedImgSrc, state.iconURL, uid])

  // マウント時、iconURLとuserNameの初期値を設定
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, 'users', user.uid))
        if (docSnap.exists()) {
          // 更新の場合は現在のプロフィールを表示
          dispatch({
            type: 'display',
            iconURL: docSnap.data().iconURL,
            userName: docSnap.data().userName,
          })
        } else {
          // 新規作成の場合はデフォルトを表示
          dispatch({ type: 'icon', iconURL: '/UnknownIcon.png' })
          if (user.displayName) {
            dispatch({ type: 'name', userName: user.displayName })
          }
        }
      }
    })
  }, [])

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      className='mx-2 mt-16'
    >
      <div className='mt-4 mb-6 text-xl text-center'>
        アイコンと名前を設定してください。
      </div>
      <Card className='flex flex-col items-center mx-16'>
        <TrimmingIcon state={state} dispatch={dispatch} />
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
          {state.error === 'username error'
            ? 'ユーザーネームは1~20字で入力してください。'
            : 'エラーが発生しました。入力内容をご確認ください。(画像サイズは最大5MBです'}
        </div>
      ) : null}
      <Button onClick={setUserProfile} className='block mx-auto mt-8 w-48'>
        完了
      </Button>
    </Modal>
  )
})
