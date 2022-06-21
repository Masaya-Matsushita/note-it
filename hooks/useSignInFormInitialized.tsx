import { z } from 'zod'
import { useForm, zodResolver } from '@mantine/form'
import { UseFormReturnType } from '@mantine/form/lib/use-form'

type SchemaType = z.ZodObject<
  {
    email: z.ZodString
    password: z.ZodString
  },
  'strip',
  z.ZodTypeAny,
  {
    email: string
    password: string
  },
  {
    email: string
    password: string
  }
>

type HookType = () => UseFormReturnType<{
  email: string
  password: string
}>

const schema: SchemaType = z.object({
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

export const useSignInFormInitialized: HookType = () => {
  const signInForm = useForm({
    schema: zodResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  })
  return signInForm
}
