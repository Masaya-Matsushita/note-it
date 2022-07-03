import { ResendVerifyEmailModal } from 'components/Modal/ResendVerifyEmailModal'
import { SendEmailTroubleModal } from 'components/Modal/SendEmailTroubleModal'
import { ErrorModal } from 'components/Modal/ErrorModal'
import { useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { Button } from '@mantine/core'

const NoVerified: NextPage = () => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [method, setMethod] = useState('')

  const toMyPage = () => {
    onAuthStateChanged(auth, (user) => {
      try {
        // 認証済でmy-pageへ遷移
        if (user?.emailVerified === true) {
          router.push(`my-page/${user.uid}`)
        } else {
          throw new Error('auth/user-not-verified')
        }
      } catch (error: any) {
        setError(error.message)
        setMethod('updateUser')
      }
    })
  }

  return (
    <>
      <ErrorModal
        error={error}
        setError={setError}
        method={method}
        setMethod={setMethod}
      />
      <div className='my-4 text-2xl font-bold text-center sm:text-4xl'>
        メールアドレスが未認証です
      </div>
      <div className='text-center sm:text-lg'>
        ログイン前にメールアドレスを認証する必要があります
      </div>
      <div className='grow my-4 border border-dark-400 border-solid'></div>
      <div className='md:mx-20'>
        <ol className='p-4 space-y-6 max-w-3xl text-lg list-inside sm:text-xl'>
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
      </div>
    </>
  )
}

export default NoVerified
