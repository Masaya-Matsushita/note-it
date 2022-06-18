import { NextPage } from 'next'
import { auth } from 'firebaseConfig/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { TextInput, Button, Box, Group, PasswordInput } from '@mantine/core'
import { AiOutlineDatabase, AiOutlineKey, AiOutlineMail } from 'react-icons/ai'
import { useRouter } from 'next/router'
import { useAuthFormInitialized } from 'hooks/useAuthFormInitialized'
import { useAuthThirdParty } from 'hooks/useAuthThirdParty'
import { useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc'

const SignIn: NextPage = () => {
  const router = useRouter()
  const form = useAuthFormInitialized()
  const { googleSignIn, redirectToTop } = useAuthThirdParty(router)

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

  useEffect(() => {
    redirectToTop()
  }, [redirectToTop])

  return (
    <div>
      <h1 className='pl-4 border-[#1a1b1e] border-b-slate-500 border-solid'>
        サインイン
      </h1>
      <Box sx={{ maxWidth: 480 }} mx='auto'>
        <form onSubmit={form.onSubmit((values) => emailSignIn(values))}>
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
      <div className='flex items-center my-20'>
        <div className='grow border border-slate-500 border-solid'></div>
        <span className='mx-6 text-lg text-slate-500'>OR</span>
        <div className='grow border border-slate-500 border-solid'></div>
      </div>
      <Button
        onClick={googleSignIn}
        size='md'
        className='text-black bg-white'
        leftIcon={<FcGoogle size={22} />}
      >
        Googleで登録
      </Button>
    </div>
  )
}

export default SignIn
