import { Button, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { SendEmailTroubleModal } from 'components/SendEmailTroubleModal'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { AiOutlineMail } from 'react-icons/ai'

const ForgotPassword: NextPage = () => {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      email: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  })

  // 再設定メール送信
  const handleSubmit = async (value: { email: string }) => {
    try {
      setLoading(true)
      auth.languageCode = 'ja'
      await sendPasswordResetEmail(auth, value.email)
      form.reset()
      showNotification({
        message: '再設定メールが送信されました。',
        autoClose: false,
        icon: <AiOutlineMail size={20} />,
        style: { padding: '15px' },
      })
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
    }
    setLoading(false)
  }

  return (
    <>
      <h1 className='text-center'>パスワード再設定</h1>
      <div className='text-center sm:text-lg'>
        パスワード再設定のリンクを送信します。メールアドレスをご入力ください。
      </div>
      <hr />
      <form
        className='px-4 mx-auto mt-10 max-w-lg'
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
        <div className='flex flex-col-reverse mt-5 xs:flex-row xs:justify-between'>
          <Link href='/login' passHref>
            <a className='mt-5 ml-2 w-full text-center text-dark-100 no-underline xs:mt-3 xs:w-auto sm:text-base'>
              ← ログインページに戻る
            </a>
          </Link>
          <Button loading={loading} className='xs:w-48 xs:h-12' type='submit'>
            送信
          </Button>
        </div>
        <SendEmailTroubleModal />
      </form>
    </>
  )
}

export default ForgotPassword
