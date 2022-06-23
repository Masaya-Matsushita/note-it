import { Modal } from '@mantine/core'
import { FcHighPriority } from 'react-icons/fc'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

type Props = {
  errorCode: string
  setError: Dispatch<SetStateAction<string>>
}

export const ErrorModal: FC<Props> = ({ errorCode, setError }) => {
  const [opened, setOpened] = useState(false)
  const [errorCodeJa, setErrorCodeJa] = useState('')

  const translateToJa = (): void => {
    if (
      errorCode === '' ||
      errorCode === 'auth/cancelled-popup-request' ||
      errorCode === 'auth/popup-closed-by-user'
    ) {
      return
    }

    setOpened(true)

    switch (errorCode) {
      case 'auth/email-already-in-use':
        setErrorCodeJa('このメールアドレスは使用されています')
        return

      case 'auth/invalid-email':
        setErrorCodeJa('メールアドレスの形式が正しくありません')
        return

      case 'auth/user-disabled':
        setErrorCodeJa('サービスの利用が停止されています')
        return

      case 'auth/user-not-found':
        setErrorCodeJa('メールアドレスまたはパスワードが違います')
        return

      case 'auth/user-mismatch':
        setErrorCodeJa(
          '認証されているユーザーと異なるアカウントが選択されました'
        )
        return

      case 'auth/weak-password':
        setErrorCodeJa('パスワードは6文字以上にしてください')
        return

      case 'auth/wrong-password':
        setErrorCodeJa('メールアドレスまたはパスワードが違います')
        return

      case 'auth/popup-blocked':
        setErrorCodeJa(
          '認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください'
        )
        return

      case 'auth/operation-not-supported-in-this-environment':
      case 'auth/auth-domain-config-required':
      case 'auth/operation-not-allowed':
      case 'auth/unauthorized-domain':
        setErrorCodeJa('現在この認証方法はご利用頂けません')
        return

      case 'auth/requires-recent-login':
        setErrorCodeJa('認証の有効期限が切れています')
        return

      default:
        setErrorCodeJa(
          'エラーが発生しました。しばらく時間をおいてお試しください'
        )
        return
    }
  }

  const handleClose = () => {
    setError('')
    setOpened(false)
  }

  useEffect(() => {
    translateToJa()
  }, [errorCode])

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title='認証エラー'
      className='mt-12'
    >
      <div className='flex'>
        <FcHighPriority size={24} />
        <div className='ml-2 sm:text-lg'>{errorCodeJa}</div>
      </div>
    </Modal>
  )
}
