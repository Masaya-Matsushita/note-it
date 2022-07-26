import {
  Box,
  Checkbox,
  Tabs,
  TextInput,
  PasswordInput,
  Group,
  Button,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { LoginAction, LoginState } from 'hooks/StateManagement/useLoginState'
import { useFormInitialized } from 'hooks/useFormInitialized'
import Link from 'next/link'
import { NextRouter } from 'next/router'
import { ComponentProps, Dispatch, FC } from 'react'
import { AiOutlineMail, AiOutlineKey, AiOutlineDatabase } from 'react-icons/ai'
import { RiBallPenLine } from 'react-icons/ri'
import { AuthDivider } from './AuthDivider'

type Props = {
  state: LoginState
  dispatch: Dispatch<LoginAction>
  router: NextRouter
}

type SignUpValues = {
  name: string
  email: string
  password: string
}

export const LoginForm: FC<Props> = ({ state, dispatch, router }) => {
  const { signUpForm } = useFormInitialized()

  // email & passwordでログイン
  const emailSignIn: ComponentProps<'form'>['onSubmit'] = async (e) => {
    try {
      e.preventDefault()
      dispatch({ type: 'loading', loading: true })
      const email = String(e.currentTarget.email.value)
      const password = String(e.currentTarget.password.value)
      await signInWithEmailAndPassword(auth, email, password)
      // localStorageにemailを保存or削除
      if (state.checked) {
        localStorage.setItem('email', email)
      } else {
        localStorage.removeItem('email')
      }
      // my-pageへ遷移
      const user = auth.currentUser
      router.push(`/my-page/${user?.uid}`)
      dispatch({ type: 'loading', loading: false })
    } catch (error: any) {
      dispatch({ type: 'error', error: error.code, method: 'signin' })
    }
  }

  // email & passwordで新規登録
  const emailSignUp = async (values: SignUpValues) => {
    try {
      dispatch({ type: 'loading', loading: true })
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
      dispatch({ type: 'loading', loading: false })
    } catch (error: any) {
      dispatch({ type: 'error', error: error.code, method: 'signup' })
    }
  }

  return (
    <Tabs className='pt-8 focus:outline-none sm:mx-8 md:mx-24' tabPadding='xl'>
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
              value={state.emailValue}
              onChange={(e) =>
                dispatch({
                  type: 'inputEmail',
                  emailValue: e.currentTarget.value,
                })
              }
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
                  checked={state.checked}
                  onChange={(e) =>
                    dispatch({
                      type: 'checked',
                      checked: e.currentTarget.checked,
                    })
                  }
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
              loading={state.loading}
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
          <form onSubmit={signUpForm.onSubmit((values) => emailSignUp(values))}>
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
              loading={state.loading}
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
  )
}
