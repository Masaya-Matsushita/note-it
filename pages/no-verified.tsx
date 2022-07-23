import { ResendVerifyEmailModal } from 'components/Modal/ResendVerifyEmailModal'
import { SendEmailTroubleModal } from 'components/Modal/SendEmailTroubleModal'
import { ErrorModal } from 'components/Modal/ErrorModal'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { Button, Stepper } from '@mantine/core'
import { useNoVerifiedState } from 'hooks/useNoVerifiedState'

const NoVerified: NextPage = () => {
  const router = useRouter()
  const { state, dispatch } = useNoVerifiedState()

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
        dispatch({ type: 'error', error: error.message, method: 'updateUser' })
      }
    })
  }

  return (
    <>
      <ErrorModal error={state.error} method={state.method} />
      <div className='my-4 text-2xl text-center sm:text-3xl'>
        メールアドレスが未認証です
      </div>
      <div className='text-center sm:text-lg'>
        メールアドレスを認証する必要があります。
      </div>
      <div className='grow my-4 border border-dark-400 border-solid'></div>
      <div className='mx-auto max-w-[620px]'>
        <Stepper
          active={state.active ? state.active : 0}
          onStepClick={(e) => dispatch({ type: 'active', active: e })}
          orientation='vertical'
          iconSize={48}
          className='p-2 mb-8'
          classNames={{
            stepIcon: 'sm:w-14 sm:h-14',
            stepLabel: 'sm:text-lg',
          }}
        >
          <Stepper.Step label='登録したアドレス宛に「認証メール」が届いていることを確認。' />
          <Stepper.Step label='メール本文内のリンクをクリックすることで認証が完了します。' />
          <Stepper.Step label='「マイページへ」ボタンからマイページへ移動してください。' />
        </Stepper>
      </div>
      <div className='mx-4'>
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
