import { AuthDivider } from 'components/Login/AuthDivider'
import { AuthProvider } from 'components/Login/AuthProvider'
import { ErrorModal } from 'components/Modal/ErrorModal'
import { useFormInitialized } from 'hooks/useFormInitialized'
import { ComponentProps, useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
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

type AuthValues = {
  name: string
  email: string
  password: string
}

const Login: NextPage = () => {
  const router = useRouter()
  const { signUpForm } = useFormInitialized()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [method, setMethod] = useState('')
  const [checked, setChecked] = useState(false)
  const [emailValue, setEmailValue] = useState('')

  // localStorageにemailが保存されていた場合、emailValueに代入&checkedをtrue
  useEffect(() => {
    if (localStorage.hasOwnProperty('email')) {
      setEmailValue(localStorage.email)
      setChecked(true)
    }
  }, [])

  // emailValue(signInのemail)へ入力
  const inputEmail: ComponentProps<'input'>['onChange'] = (e) => {
    setEmailValue(e.currentTarget.value)
  }

  // email & passwordでログイン
  const emailSignIn: ComponentProps<'form'>['onInput'] = async (e) => {
    try {
      e.preventDefault()
      setLoading(true)
      const email = e.currentTarget.email.value
      const password = e.currentTarget.password.value
      await signInWithEmailAndPassword(auth, email, password)
      // checkedの値で分岐
      if (checked) {
        // localStorageにemailを保存
        localStorage.setItem('email', email)
      } else {
        // localStorageのemailを削除
        localStorage.removeItem('email')
      }
      // my-pageへ遷移
      const user = auth.currentUser
      router.push(`/my-page/${user?.uid}`)
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
        // displayNameにnameを設定
        await updateProfile(user, { displayName: values.name })
        auth.languageCode = 'ja'
        // 確認メールを送信
        await sendEmailVerification(user)
        showNotification({
          title: '認証メールを送信しました！',
          message: 'メールフォルダをご確認ください',
          autoClose: 10000,
          icon: <AiOutlineMail size={20} />,
          style: { padding: '15px' },
        })
        // my-pageへ遷移
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
                value={emailValue}
                onChange={inputEmail}
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
          <AuthDivider label='ログイン' />
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
          <AuthDivider label='新規登録' />
        </Tabs.Tab>
      </Tabs>
      <AuthProvider router={router} />
    </>
  )
}

export default Login
