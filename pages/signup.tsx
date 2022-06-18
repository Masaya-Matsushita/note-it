import { NextPage } from 'next'
import { auth } from 'firebaseConfig/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { TextInput, Button, Box, Group, PasswordInput } from '@mantine/core'
import { AiOutlineDatabase, AiOutlineKey, AiOutlineMail } from 'react-icons/ai'
import { useRouter } from 'next/router'
import { useAuthFormInitialized } from 'hooks/useAuthFormInitialized'

const SignUp: NextPage = () => {
  const router = useRouter()
  const form = useAuthFormInitialized()

  const handleSubmit = async (values: { email: string; password: string }) => {
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

  return (
    <div>
      <h1 className='pl-4 border-[#1a1b1e] border-b-slate-500 border-solid'>
        新規登録
      </h1>
      <Box sx={{ maxWidth: 480 }} mx='auto'>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
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
    </div>
  )
}

export default SignUp
