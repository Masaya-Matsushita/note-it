import { z } from 'zod'
import { useForm, zodResolver } from '@mantine/form'

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: '2~10文字で入力してください。' })
    .max(10, { message: '2~10文字で入力してください。' }),
  email: z
    .string()
    .trim()
    .email({ message: 'メールアドレスが正しくありません。' }),
  password: z
    .string()
    .trim()
    .regex(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{6,100}$/i, {
      message: '「半角英数をそれぞれ含む6文字以上」で入力してください。',
    }),
})

export const useSignUpFormInitialized = () => {
  const signUpForm = useForm({
    schema: zodResolver(schema),
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
  })
  return signUpForm
}
