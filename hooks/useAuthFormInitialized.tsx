import { z } from 'zod'
import { useForm, zodResolver } from '@mantine/form'

const schema = z.object({
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

export const useAuthFormInitialized = () => {
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  })
  return form
}
