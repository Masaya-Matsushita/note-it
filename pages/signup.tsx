import { NextPage } from 'next'
import { auth } from 'firebaseConfig/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {
  TextInput,
  Button,
  Box,
  Group,
  PasswordInput,
  Tabs,
} from '@mantine/core'
import { AiOutlineDatabase, AiOutlineKey, AiOutlineMail } from 'react-icons/ai'
import { useRouter } from 'next/router'
import { useAuthFormInitialized } from 'hooks/useAuthFormInitialized'
import { useAuthThirdParty } from 'hooks/useAuthThirdParty'
import { useEffect } from 'react'
import Image from 'next/image'

const SignUp: NextPage = () => {
  const router = useRouter()
  const form = useAuthFormInitialized()
  const { googleSignIn, githubSignIn, redirectToTop } =
    useAuthThirdParty(router)

  const emailSignUp = async (values: { email: string; password: string }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
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

  useEffect(() => {
    redirectToTop()
  }, [redirectToTop])

  return (
    <div>
      <Tabs className='pt-8 focus:outline-none' tabPadding='xl'>
        <Tabs.Tab label='ログイン' className='pb-2 pl-4 text-2xl font-bold'>
          hello
        </Tabs.Tab>
        <Tabs.Tab label='新規登録' className='pb-2 pl-4 text-2xl font-bold'>
          <Box sx={{ maxWidth: 480 }} mx='auto'>
            <form onSubmit={form.onSubmit((values) => emailSignUp(values))}>
              <TextInput
                required
                id='email'
                label='Email'
                placeholder='example@mail.com'
                size='md'
                icon={<AiOutlineMail />}
                {...form.getInputProps('email')}
              />
              <PasswordInput
                required
                id='password'
                label='Password'
                placeholder='半角英数6文字以上'
                mt='sm'
                size='md'
                icon={<AiOutlineKey />}
                {...form.getInputProps('password')}
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
        </Tabs.Tab>
      </Tabs>
      <div className='flex items-center mt-12 mb-8 xs:mt-16 xs:mb-12 lg:mt-20 lg:mb-16'>
        <div className='grow border border-dark-300 border-solid'></div>
        <span className='mx-6 text-lg text-dark-100'>OR</span>
        <div className='grow border border-dark-300 border-solid'></div>
      </div>
      <div className='mb-6 text-lg text-center xs:mb-10 lg:mb-12 lg:text-xl'>
        お持ちのアカウントで登録/ログイン
      </div>
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
