import { Button, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { ErrorModal } from 'components/ErrorModal'
import { SendEmailTroubleModal } from 'components/SendEmailTroubleModal'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { AiOutlineMail } from 'react-icons/ai'

const ForgotPassword: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // フォームの初期値、バリデーションを設定
  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : 'メールアドレスが正しくありません。',
    },
  })

  // 再設定メールを送信
  const handleSubmit = async (value: { email: string }) => {
    try {
      setLoading(true)
      auth.languageCode = 'ja'
      await sendPasswordResetEmail(auth, value.email)
      form.reset()
      showNotification({
        message: '再設定メールが送信されました。',
        autoClose: 10000,
        icon: <AiOutlineMail size={20} />,
        style: { padding: '15px' },
      })
    } catch (error: any) {
      setError(error.code)
    }
    setLoading(false)
  }

  return (
    <>
      <ErrorModal error={error} setError={setError} />
      <div className='my-4 text-2xl font-bold text-center sm:text-4xl'>
        パスワード再設定
      </div>
      <div className='text-center sm:text-lg'>
        パスワード再設定のリンクを送信します。メールアドレスをご入力ください。
      </div>
      <div className='grow my-4 border border-dark-400 border-solid'></div>
      <form
        className='px-4 mx-auto mt-8 max-w-lg'
        onSubmit={form.onSubmit((value) => handleSubmit(value))}
      >
        <TextInput
          required
          label='Your Email'
          placeholder='example@mail.com'
          size='md'
          icon={<AiOutlineMail />}
          {...form.getInputProps('email')}
        />
        <div className='flex flex-col-reverse mt-6 xs:flex-row xs:justify-between'>
          <Link href='/login' passHref>
            <a className='mt-5 ml-2 w-full text-center text-dark-100 no-underline xs:mt-2 xs:w-auto sm:text-base'>
              ← ログインページに戻る
            </a>
          </Link>
          <Button loading={loading} className='xs:w-48 xs:h-12' type='submit'>
            送信
          </Button>
        </div>
        <SendEmailTroubleModal resendButton={false} />
      </form>
    </>
  )
}

export default ForgotPassword
