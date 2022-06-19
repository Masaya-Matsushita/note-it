import { NextPage } from 'next'
import { auth } from 'firebaseConfig/firebase'
import {
  createUserWithEmailAndPassword,
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
import { AiOutlineDatabase, AiOutlineKey, AiOutlineMail } from 'react-icons/ai'
import { RiBallPenLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import { useSignUpFormInitialized } from 'hooks/useSignUpFormInitialized'
import { useAuthThirdParty } from 'hooks/useAuthThirdParty'
import { useEffect } from 'react'
import { AuthDivider } from 'components/AuthDivider'
import { useSignInFormInitialized } from 'hooks/useSignInFormInitialized'
import { AuthValues } from 'types/AuthValues'
import { AuthProvider } from 'components/AuthProvider'

const Login: NextPage = () => {
  const router = useRouter()
  const signInForm = useSignInFormInitialized()
  const signUpForm = useSignUpFormInitialized()
  const { googleSignIn, githubSignIn, redirectToTop } =
    useAuthThirdParty(router)

  const emailSignIn = async (values: Omit<AuthValues, 'name'>) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message
        console.log(errorMessage)
      }
    }
  }

  const emailSignUp = async (values: AuthValues) => {
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password)
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: values.name })
      }
      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message
        console.log(errorMessage)
      }
    }
  }

  useEffect(() => {
    redirectToTop()
  }, [redirectToTop])

  return (
    <div>
      <Tabs className='pt-8 focus:outline-none' tabPadding='xl'>
        <Tabs.Tab
          label='ログイン'
          className='px-4 pb-2 text-2xl font-bold sm:px-6 md:px-8'
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

              <Group position='right' mt='xl' className='pb-6'>
                <Button
                  type='submit'
                  size='md'
                  leftIcon={<AiOutlineDatabase />}
                >
                  ログイン
                </Button>
              </Group>
            </form>
          </Box>
          <AuthDivider />
          <div className='mb-6 text-lg text-center xs:mb-10 lg:mb-12 lg:text-xl'>
            お持ちのアカウントで
            <span className='pl-1 font-bold text-blue-200'>ログイン</span>
          </div>
        </Tabs.Tab>
        <Tabs.Tab
          label='新規登録'
          className='px-4 pb-2 text-2xl font-bold sm:px-6 md:px-8'
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
                  leftIcon={<AiOutlineDatabase />}
                >
                  登録
                </Button>
              </Group>
            </form>
          </Box>
          <AuthDivider />
          <div className='mb-6 text-lg text-center xs:mb-10 lg:mb-12 lg:text-xl'>
            お持ちのアカウントで
            <span className='pl-1 font-bold text-blue-200'>新規登録</span>
          </div>
        </Tabs.Tab>
      </Tabs>
      <AuthProvider googleSignIn={googleSignIn} githubSignIn={githubSignIn} />
    </div>
  )
}

export default Login
