import { Button } from '@mantine/core'
import { ResendVerifyEmailModal } from 'components/ResendVerifyEmailModal'
import { SendEmailTroubleModal } from 'components/SendEmailTroubleModal'
import { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ErrorModal } from 'components/ErrorModal'

const NoVerified: NextPage = () => {
  const router = useRouter()
  const [error, setError] = useState('')

  const toMyPage = () => {
    // ボタンを押す度にuserを初期化、再定義したい
    // リロードすると再定義できる
    try {
      const user = auth.currentUser
      // 認証済でmy-pageへ遷移
      if (user?.emailVerified === true) {
        router.push(`my-page/${user.uid}`)
      } else {
        throw new Error('auth/user-not-verified')
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <>
      <ErrorModal error={error} setError={setError} />
      <div className='my-4 text-2xl font-bold text-center sm:text-4xl'>
        メールアドレスが未認証です
      </div>
      <hr />
      <ol className='p-4 space-y-6 text-lg list-inside sm:text-xl md:text-2xl'>
        <li>
          登録したメールアドレス宛に「認証メール」が届いていることを確認。
        </li>
        <li>メール本文内のリンクをクリックすることで認証が完了します。</li>
        <li>「マイページへ」ボタンからマイページへ移動してください。</li>
      </ol>
      <Button
        className='block mb-8 ml-auto w-full xs:w-48 xs:h-12 xs:text-lg'
        onClick={toMyPage}
      >
        マイページへ
      </Button>
      <SendEmailTroubleModal resendButton={true} />
      <ResendVerifyEmailModal />
    </>
  )
}

export default NoVerified
