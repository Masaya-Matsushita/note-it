import { ErrorModal } from 'components/Modal/ErrorModal'
import { SendEmailTroubleModal } from 'components/Modal/SendEmailTroubleModal'
import { NextPage } from 'next'
import Link from 'next/link'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { showNotification } from '@mantine/notifications'
import { Button, TextInput } from '@mantine/core'
import { AiOutlineMail } from 'react-icons/ai'
import { useFormInitialized } from 'hooks/useFormInitialized'
import { TitleWrapper } from 'components/Parts/TitleWrapper'
import { useForgotPasswordState } from 'hooks/StateManagement/useForgotPasswordState'

const ForgotPassword: NextPage = () => {
  const { state, dispatch } = useForgotPasswordState()
  const { emailForm } = useFormInitialized()

  // 再設定メールを送信
  const handleSubmit = async (value: { email: string }) => {
    try {
      dispatch({ type: 'loading' })
      auth.languageCode = 'ja'
      await sendPasswordResetEmail(auth, value.email)
      emailForm.reset()
      showNotification({
        message: '再設定メールが送信されました。',
        autoClose: 10000,
        icon: <AiOutlineMail size={20} />,
        style: { padding: '15px' },
      })
    } catch (error: any) {
      dispatch({ type: 'error', error: error.code })
    }
    dispatch({ type: 'end' })
  }

  return (
    <>
      <ErrorModal error={state.error} dispatch={dispatch} />
      <TitleWrapper
        title='パスワード再設定'
        subTitle='パスワード再設定のリンクを送信します。メールアドレスをご入力ください。'
      >
        <form
          className='px-4 mx-auto mt-12 max-w-lg'
          onSubmit={emailForm.onSubmit((value) => handleSubmit(value))}
        >
          <TextInput
            required
            label='Your Email'
            placeholder='example@mail.com'
            size='md'
            icon={<AiOutlineMail />}
            {...emailForm.getInputProps('email')}
          />
          <div className='flex flex-col-reverse mt-8 xs:flex-row xs:justify-between'>
            <Link href='/login' passHref>
              <a className='mt-5 ml-2 w-full text-center text-dark-100 no-underline xs:mt-2 xs:w-auto sm:text-base'>
                ← ログインページに戻る
              </a>
            </Link>
            <Button
              loading={state.loading}
              className='xs:w-48 xs:h-12'
              type='submit'
            >
              送信
            </Button>
          </div>
          <SendEmailTroubleModal resendButton={false} />
        </form>
      </TitleWrapper>
    </>
  )
}

export default ForgotPassword
