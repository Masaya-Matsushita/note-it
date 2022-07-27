import { Dispatch, FC, memo, useCallback, useEffect, useState } from 'react'
import { NextRouter } from 'next/router'
import { Button, Modal } from '@mantine/core'
import { MdErrorOutline } from 'react-icons/md'

type Props = {
  router?: NextRouter
  error: string
  method?: string
  dispatch: Dispatch<any>
}

// eslint-disable-next-line react/display-name
export const ErrorModal: FC<Props> = memo(
  ({ router, error, method, dispatch }) => {
    const [opened, setOpened] = useState(false)
    const [errorCodeJa, setErrorCodeJa] = useState('')

    useEffect(() => {
      if (!error) {
        return
      }
      // errorを日本語に翻訳してモーダルで表示
      setOpened(true)
      switch (error) {
        case 'note/required-form': {
          setErrorCodeJa('未入力の箇所があります。')
          return
        }
        case 'auth/email-already-in-use': {
          if (method === 'signup') {
            setErrorCodeJa('このメールアドレスは使用されています。')
          } else {
            setErrorCodeJa('メールアドレスまたはパスワードが違います。')
          }
          return
        }
        case 'auth/invalid-email': {
          setErrorCodeJa('メールアドレスの形式が正しくありません。')
          return
        }
        case 'auth/user-disabled': {
          setErrorCodeJa('サービスの利用が停止されています。')
          return
        }
        case 'auth/user-not-found': {
          setErrorCodeJa('メールアドレスまたはパスワードが違います。')
          return
        }
        case 'auth/user-mismatch': {
          setErrorCodeJa('メールアドレスまたはパスワードが違います。')
          return
        }
        case 'auth/weak-password': {
          setErrorCodeJa('パスワードは6文字以上にしてください。')
          return
        }
        case 'auth/wrong-password': {
          setErrorCodeJa('メールアドレスまたはパスワードが違います。')
          return
        }
        case 'auth/popup-blocked': {
          setErrorCodeJa(
            '認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください。'
          )
          return
        }
        case 'auth/operation-not-supported-in-this-environment':
        case 'auth/auth-domain-config-required':
        case 'auth/operation-not-allowed':
        case 'auth/unauthorized-domain': {
          setErrorCodeJa('現在この認証方法はご利用頂けません。')
          return
        }
        case 'auth/requires-recent-login': {
          setErrorCodeJa('認証の有効期限が切れています。')
          return
        }
        case 'auth/user-not-verified': {
          setErrorCodeJa(
            'メールアドレスが未認証です。タイミングによっては反映されていないことがあります。'
          )
          return
        }
        case 'auth/user-cancelled': {
          setErrorCodeJa('認証をキャンセルしました。')
          return
        }
        case 'auth/account-exists-with-different-credential': {
          setErrorCodeJa(
            ' このメールアドレスは既に別の方法で認証されています。別の方法でログインしてください。'
          )
          return
        }
        case 'auth /credential-already-in-use': {
          setErrorCodeJa('アカウントが既に存在します。')
          return
        }
        case 'auth/web-storage-unsupported': {
          setErrorCodeJa(
            'third-party cookie の設定が無効になってる可能性があります。ブラウザの設定をご確認ください。'
          )
          return
        }
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
      }
    }, [error, method])

    const handleClose = useCallback(() => {
      // error,methodを初期値に戻す＆モーダルを閉じる
      dispatch({ type: 'resetError' })
      setOpened(false)
      // no-verifiedページの場合、ページリロード処理
      if (method === 'updateUser') {
        location.reload()
      }
    }, [method, dispatch])

    return (
      <Modal
        opened={opened}
        onClose={handleClose}
        title={error === 'note/required-form' ? 'エラー' : '認証エラー'}
        className='mt-16'
      >
        <div className='flex'>
          <MdErrorOutline color={'#a23535'} size={28} />
          <div className='ml-1 sm:text-lg'>{errorCodeJa}</div>
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
)
