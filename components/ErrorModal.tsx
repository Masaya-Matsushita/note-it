import { Button, Modal } from '@mantine/core'
import { FcHighPriority } from 'react-icons/fc'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { NextRouter } from 'next/router'

type Props = {
  router?: NextRouter
  error: string
  setError: Dispatch<SetStateAction<string>>
  method?: string
  setMethod?: Dispatch<SetStateAction<string>>
}

export const ErrorModal: FC<Props> = ({
  router,
  error,
  setError,
  method,
  setMethod,
}) => {
  const [opened, setOpened] = useState(false)
  const [errorCodeJa, setErrorCodeJa] = useState('')

  // errorを日本語に翻訳してモーダルで表示
  const translateToJa = (): void => {
    // 初期値では何もしない
    if (error === '') {
      return
    }
    // モーダルを表示
    setOpened(true)
    // errorを日本語に翻訳
    switch (error) {
      case 'auth/email-already-in-use':
        if (method === 'signup') {
          setErrorCodeJa('このメールアドレスは使用されています。')
        } else {
          setErrorCodeJa('メールアドレスまたはパスワードが違います。')
        }
        return

      case 'auth/invalid-email':
        setErrorCodeJa('メールアドレスの形式が正しくありません。')
        return

      case 'auth/user-disabled':
        setErrorCodeJa('サービスの利用が停止されています。')
        return

      case 'auth/user-not-found':
        setErrorCodeJa('メールアドレスまたはパスワードが違います。')
        return

      case 'auth/user-mismatch':
        setErrorCodeJa('メールアドレスまたはパスワードが違います。')
        return

      case 'auth/weak-password':
        setErrorCodeJa('パスワードは6文字以上にしてください。')
        return

      case 'auth/wrong-password':
        setErrorCodeJa('メールアドレスまたはパスワードが違います。')
        return

      case 'auth/popup-blocked':
        setErrorCodeJa(
          '認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください。'
        )
        return

      case 'auth/operation-not-supported-in-this-environment':
      case 'auth/auth-domain-config-required':
      case 'auth/operation-not-allowed':
      case 'auth/unauthorized-domain':
        setErrorCodeJa('現在この認証方法はご利用頂けません。')
        return

      case 'auth/requires-recent-login':
        setErrorCodeJa('認証の有効期限が切れています。')
        return

      case 'auth/user-not-verified':
        setErrorCodeJa(
          'メールアドレスが未認証です。タイミングによっては反映されていないことがあります。'
        )
        return

      case 'auth/user-cancelled':
        setErrorCodeJa('認証をキャンセルしました。')
        return

      case 'auth/account-exists-with-different-credential':
        setErrorCodeJa(
          ' このメールアドレスは既に別の方法で認証されています。別の方法でログインしてください。'
        )
        return

      case 'auth /credential-already-in-use':
        setErrorCodeJa('アカウントが既に存在します。')
        return
      default:
        if (method === 'signin') {
          setErrorCodeJa(
            '認証に失敗しました。しばらく時間をおいて再度お試しください。'
          )
        } else {
          setErrorCodeJa(
            'エラーが発生しました。しばらく時間をおいてお試しください。'
          )
        }
        return
    }
  }

  // error,methodを初期値に戻す＆モーダルを閉じる
  // no-verifiedページの場合、ページリロード処理
  const handleClose = () => {
    setError('')
    if (setMethod) {
      setMethod('')
    }
    setOpened(false)
    if (method === 'updateUser') {
      location.reload()
    }
  }

  // errorに値が入ると実行
  useEffect(() => {
    translateToJa()
  }, [error])

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
      {/* auth-redirectページの場合、ログイン画面へボタンを表示 */}
      {method === 'redirect' ? (
        <Button
          className='block mt-2 mr-2 ml-auto'
          onClick={() => router?.push('/login')}
        >
          ログイン画面へ戻る
        </Button>
      ) : null}
    </Modal>
  )
}
