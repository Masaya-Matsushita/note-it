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
import Image from 'next/image'
import { AuthDivider } from 'components/AuthDivider'
import { useSignInFormInitialized } from 'hooks/useSignInFormInitialized'

const SignUp: NextPage = () => {
  const router = useRouter()
  const signInForm = useSignInFormInitialized()
  const signUpForm = useSignUpFormInitialized()
  const { googleSignIn, githubSignIn, redirectToTop } =
    useAuthThirdParty(router)

  const emailSignIn = async (values: { email: string; password: string }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      )
      const user = userCredential.user
      console.log(userCredential, user)

      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message
        console.log(errorMessage)
      }
    }
  }

  const emailSignUp = async (values: {
    name: string
    email: string
    password: string
  }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      )
      const user = userCredential.user
      console.log(userCredential, user)
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
      <div className='flex justify-center items-center'>
        <div className='flex flex-col items-center'>
          <div className='relative w-16 h-16 xs:w-20 xs:h-20'>
            <Image
              src='/google-logo.png'
              layout='fill'
              alt='google'
              priority
              onClick={googleSignIn}
            />
          </div>
          <div className='mt-2'>Google</div>
        </div>
        <div className='flex flex-col items-center px-8 xs:px-14 md:px-16 lg:px-20'>
          <div className='relative w-16 h-16 xs:w-20 xs:h-20'>
            <Image
              src='/twitter-logo.png'
              layout='fill'
              alt='twitter'
              priority
              onClick={googleSignIn}
            />
          </div>
          <div className='mt-2'>Twitter</div>
        </div>
        <div className='flex flex-col items-center'>
          <div className='relative w-16 h-16 rounded-full border border-dark-400 border-solid xs:w-20 xs:h-20'>
            <Image
              src='/github-logo.png'
              layout='fill'
              alt='github'
              priority
              onClick={githubSignIn}
            />
          </div>
          <div className='mt-2'>GitHub</div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
