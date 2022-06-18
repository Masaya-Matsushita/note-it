import { NextPage } from 'next'
import { auth } from 'firebaseConfig/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { TextInput, Button, Box, Group, PasswordInput } from '@mantine/core'
import { useRouter } from 'next/router'
import { useAuthFormInitialized } from 'hooks/useAuthFormInitialized'

const SignIn: NextPage = () => {
  const router = useRouter()
  const form = useAuthFormInitialized()

  const handleSubmit = async (values: { email: string; password: string }) => {
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

  return (
    <div>
      <h1 className='border-white border-b-slate-300 border-solid'>
        サインイン
      </h1>
      <Box sx={{ maxWidth: 480 }} mx='auto'>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            required
            id='email'
            label='Email'
            placeholder='example@mail.com'
            size='md'
            {...form.getInputProps('email')}
          />
          <PasswordInput
            required
            id='password'
            label='Password'
            placeholder='半角英数6文字以上'
            mt='sm'
            size='md'
            {...form.getInputProps('password')}
          />

          <Group position='right' mt='xl'>
            <Button type='submit' size='md'>
              登録
            </Button>
          </Group>
        </form>
      </Box>
    </div>
  )
}

export default SignIn
