import { NextPage } from 'next'
import { auth } from 'firebaseConfig/firebase'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import {
  TextInput,
  Button,
  Box,
  Group,
  PasswordInput,
  Tabs,
  Checkbox,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { AiOutlineDatabase, AiOutlineKey, AiOutlineMail } from 'react-icons/ai'
import { RiBallPenLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import { useSignUpFormInitialized } from 'hooks/useSignUpFormInitialized'
import { AuthDivider } from 'components/AuthDivider'
import { AuthProvider } from 'components/AuthProvider'
import Link from 'next/link'
import { ComponentProps, useState } from 'react'
import { ErrorModal } from 'components/ErrorModal'

type AuthValues = {
  name: string
  email: string
  password: string
}

const Login: NextPage = () => {
  const router = useRouter()
  const signUpForm = useSignUpFormInitialized()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [method, setMethod] = useState('')
  const [checked, setChecked] = useState(false)

  // email & passwordでログイン
  const emailSignIn: ComponentProps<'form'>['onInput'] = async (e) => {
    try {
      e.preventDefault()
      setLoading(true)
      const email = e.currentTarget.email.value
      const password = e.currentTarget.password.value
      await signInWithEmailAndPassword(auth, email, password)
      const user = auth.currentUser
      if (user) {
        router.push(`/my-page/${user.uid}`)
      }
    } catch (error: any) {
      setMethod('signin')
      setError(error.code)
    }
    setLoading(false)
  }

  // email & passwordで新規登録
  const emailSignUp = async (values: AuthValues) => {
    try {
      setLoading(true)
      await createUserWithEmailAndPassword(auth, values.email, values.password)
      const user = auth.currentUser
      if (user) {
        await updateProfile(user, { displayName: values.name })
        auth.languageCode = 'ja'
        await sendEmailVerification(user)
        showNotification({
          title: '認証メールを送信しました！',
          message: 'メールフォルダをご確認ください',
          autoClose: 10000,
          icon: <AiOutlineMail size={20} />,
          style: { padding: '15px' },
        })
        router.push(`/my-page/${user.uid}`)
      }
    } catch (error: any) {
      setMethod('signup')
      setError(error.code)
    }
    setLoading(false)
  }

  return (
    <>
      <ErrorModal
        error={error}
        setError={setError}
        method={method}
        setMethod={setMethod}
      />
      <Tabs className='pt-8 focus:outline-none' tabPadding='xl'>
        <Tabs.Tab
          label='ログイン'
          className='px-4 pb-2 text-xl font-bold text-dark-300 xxs:text-2xl sm:px-6 md:px-8'
        >
          <Box sx={{ maxWidth: 480 }} mx='auto'>
            <form onSubmit={emailSignIn}>
              <TextInput
                required
                id='email'
                name='email'
                label='Email'
                placeholder='example@mail.com'
                size='md'
                icon={<AiOutlineMail />}
              />
              <PasswordInput
                required
                id='name'
                name='password'
                label='Password'
                placeholder='半角英数6文字以上'
                mt='sm'
                size='md'
                icon={<AiOutlineKey />}
              />
              <Group position='apart' mt='lg' className='text-dark-200'>
                <label htmlFor='checkbox' className='flex items-center'>
                  <Checkbox
                    id='checkbox'
                    checked={checked}
                    onChange={(e) => setChecked(e.currentTarget.checked)}
                    className='inline-block mr-2'
                  />
                  メールアドレスを記憶する
                </label>
                <Link href={'/forgot-password'} passHref>
                  <a className='text-dark-200'>パスワードをお忘れですか？</a>
                </Link>
              </Group>
              <Button
                type='submit'
                size='md'
                loading={loading}
                leftIcon={<AiOutlineDatabase />}
                className='block mx-auto mt-8 w-full xs:mt-6  xs:mr-0 xs:ml-auto xs:w-40 xs:h-12'
              >
                ログイン
              </Button>
            </form>
          </Box>
          <AuthDivider />
          <div className='mb-6 text-center xxs:text-lg xs:mb-10 lg:mb-12 lg:text-xl'>
            お持ちのアカウントで
            <span className='pl-1 font-bold text-blue-200'>ログイン</span>
          </div>
        </Tabs.Tab>
        <Tabs.Tab
          label='新規登録'
          className='px-4 pb-2 text-xl font-bold text-dark-300 xxs:text-2xl sm:px-6 md:px-8'
        >
          <Box sx={{ maxWidth: 480 }} mx='auto'>
            <form
              onSubmit={signUpForm.onSubmit((values) => emailSignUp(values))}
            >
              <TextInput
                required
                id='username'
                label='User Name'
                placeholder='User Name'
                size='md'
                icon={<RiBallPenLine />}
                {...signUpForm.getInputProps('name')}
              />
              <TextInput
                required
                id='email'
                label='Email'
                placeholder='example@mail.com'
                mt='sm'
                size='md'
                icon={<AiOutlineMail />}
                {...signUpForm.getInputProps('email')}
              />
              <PasswordInput
                required
                id='password'
                label='Password'
                placeholder='半角英数6文字以上'
                mt='sm'
                size='md'
                icon={<AiOutlineKey />}
                {...signUpForm.getInputProps('password')}
              />
              <Button
                type='submit'
                size='md'
                loading={loading}
                leftIcon={<AiOutlineDatabase />}
                className='block mx-auto mt-8 w-full xs:mt-6  xs:mr-0 xs:ml-auto xs:w-40 xs:h-12'
              >
                新規登録
              </Button>
            </form>
          </Box>
          <AuthDivider />
          <div className='mb-6 text-center xxs:text-lg xs:mb-10 lg:mb-12 lg:text-xl'>
            お持ちのアカウントで
            <span className='pl-1 font-bold text-blue-200'>新規登録</span>
          </div>
        </Tabs.Tab>
      </Tabs>
      <AuthProvider />
    </>
  )
}

export default Login
