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
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { AiOutlineDatabase, AiOutlineKey, AiOutlineMail } from 'react-icons/ai'
import { RiBallPenLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import { useSignUpFormInitialized } from 'hooks/useSignUpFormInitialized'
import { AuthDivider } from 'components/AuthDivider'
import { useSignInFormInitialized } from 'hooks/useSignInFormInitialized'
import { AuthProvider } from 'components/AuthProvider'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type AuthValues = {
  name: string
  email: string
  password: string
}

const Login: NextPage = () => {
  const router = useRouter()
  const signInForm = useSignInFormInitialized()
  const signUpForm = useSignUpFormInitialized()
  const [loading, setLoading] = useState(false)

  const emailSignIn = async (
    values: Omit<AuthValues, 'name'>
  ): Promise<void> => {
    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, values.email, values.password)
      const user = auth.currentUser
      if (user) {
        router.push(`/my-page/${user.uid}`)
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message
        console.log(errorMessage)
      }
    }
    setLoading(false)
  }

  const emailSignUp = async (values: AuthValues): Promise<void> => {
    try {
      setLoading(true)
      await createUserWithEmailAndPassword(auth, values.email, values.password)
      const user = auth.currentUser
      if (user) {
        await updateProfile(user, { displayName: values.name })
        auth.languageCode = 'ja'
        await sendEmailVerification(user)
        showNotification({
          title: 'ようこそ！',
          message: '認証メールが届いていることを確認してください。',
          autoClose: 10000,
          icon: <AiOutlineMail size={20} />,
          style: { padding: '15px' },
        })
        router.push(`/my-page/${user.uid}`)
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message
        console.log(errorMessage)
      }
    }
    setLoading(false)
  }

  return (
    <div>
      <Tabs className='pt-8 focus:outline-none' tabPadding='xl'>
        <Tabs.Tab
          label='ログイン'
          className='px-4 pb-2 text-xl font-bold text-dark-300 xxs:text-2xl sm:px-6 md:px-8'
        >
          <Box sx={{ maxWidth: 480 }} mx='auto'>
            <form
              onSubmit={signInForm.onSubmit((values) => emailSignIn(values))}
            >
              <TextInput
                required
                id='email'
                label='Email'
                placeholder='example@mail.com'
                size='md'
                className='mt-4'
                icon={<AiOutlineMail />}
                {...signInForm.getInputProps('email')}
              />
              <PasswordInput
                required
                id='password'
                label='Password'
                placeholder='半角英数6文字以上'
                mt='sm'
                size='md'
                icon={<AiOutlineKey />}
                {...signInForm.getInputProps('password')}
              />
              <div className='flex justify-end'>
                <Link href={'/forgot-password'} passHref>
                  <a className='inline-block mt-2 mr-2 text-dark-200'>
                    パスワードをお忘れですか？
                  </a>
                </Link>
              </div>
              <Group position='right' mt='xl' className='pb-6'>
                <Button
                  type='submit'
                  size='md'
                  loading={loading}
                  leftIcon={<AiOutlineDatabase />}
                >
                  ログイン
                </Button>
              </Group>
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

              <Group position='right' mt='xl'>
                <Button
                  type='submit'
                  size='md'
                  loading={loading}
                  leftIcon={<AiOutlineDatabase />}
                >
                  登録
                </Button>
              </Group>
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
    </div>
  )
}

export default Login
