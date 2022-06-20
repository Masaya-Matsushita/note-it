import { Button, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import Link from 'next/link'
import { AiOutlineMail } from 'react-icons/ai'

const ForgotPassword: NextPage = () => {
  const form = useForm({
    initialValues: {
      email: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  })

  const handleSubmit = async (value: { email: string }) => {
    console.log(value)
    try {
      auth.languageCode = 'ja'
      await sendPasswordResetEmail(auth, value.email)
      form.reset()
      showNotification({
        message: '再設定メールが送信されました。',
        autoClose: 5000,
        icon: <AiOutlineMail size={20} />,
        style: { padding: '15px' },
      })
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message
        console.log(errorMessage)
      }
    }
  }

  return (
    <div>
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
            <a className='mt-3 ml-2 w-full text-sm text-center text-dark-100 no-underline xs:w-auto sm:text-base'>
              ← ログインページに戻る
            </a>
          </Link>
          <Button className='xs:w-32 xs:h-10' type='submit'>
            送信
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword
