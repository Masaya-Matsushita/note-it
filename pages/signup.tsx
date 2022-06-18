import { NextPage } from 'next'
import { auth } from 'firebaseConfig/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { TextInput, Button, Box, Group, PasswordInput } from '@mantine/core'
import { AiOutlineDatabase, AiOutlineKey, AiOutlineMail } from 'react-icons/ai'
import { useRouter } from 'next/router'
import { useAuthFormInitialized } from 'hooks/useAuthFormInitialized'
import { useAuthThirdParty } from 'hooks/useAuthThirdParty'
import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const SignUp: NextPage = () => {
  const router = useRouter()
  const form = useAuthFormInitialized()
  const { googleSignIn, facebookSignIn, redirectToTop } =
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
      <h1 className='pl-4 border-[#1a1b1e] border-b-slate-500 border-solid'>
        新規登録
      </h1>
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
            <Button type='submit' size='md' leftIcon={<AiOutlineDatabase />}>
              登録
            </Button>
          </Group>
        </form>
      </Box>
      <div className='flex items-center mt-10 mb-12'>
        <div className='grow border border-slate-500 border-solid'></div>
        <span className='mx-6 text-lg text-slate-300'>OR</span>
        <div className='grow border border-slate-500 border-solid'></div>
      </div>
      <div className='mb-8 text-lg text-center'>お持ちのアカウントで登録</div>
      <div className='flex justify-center items-center'>
        <div className='flex flex-col items-center'>
          <Image
            src='/google-logo.png'
            width='80px'
            height='80px'
            alt='google'
            priority
            onClick={googleSignIn}
          />
          <div className='mt-2'>Google</div>
        </div>
        <div className='flex flex-col items-center px-20'>
          <Image
            src='/facebook-logo.png'
            width='80px'
            height='80px'
            alt='facebook'
            priority
            onClick={facebookSignIn}
          />
          <div className='mt-2'>Facebook</div>
        </div>
        <div className='flex flex-col items-center'>
          <Image
            src='/twitter-logo.png'
            width='80px'
            height='80px'
            alt='twitter'
            priority
            onClick={googleSignIn}
          />
          <div className='mt-2'>Twitter</div>
        </div>
      </div>
      <Link href='/signin'>
        <a className='block mt-12 mr-8 text-lg text-right text-slate-300'>
          登録済みの方はこちら
        </a>
      </Link>
    </div>
  )
}

export default SignUp
