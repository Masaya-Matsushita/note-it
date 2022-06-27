import { z } from 'zod'
import { useForm, zodResolver } from '@mantine/form'
import { UseFormReturnType } from '@mantine/form/lib/use-form'

type SchemaType = z.ZodObject<
  {
    name: z.ZodString
    email: z.ZodString
    password: z.ZodString
  },
  'strip',
  z.ZodTypeAny,
  {
    name: string
    email: string
    password: string
  },
  {
    name: string
    email: string
    password: string
  }
>

type HookType = () => UseFormReturnType<{
  name: string
  email: string
  password: string
}>

// フォームのバリデーションを定義
const schema: SchemaType = z.object({
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

export const useSignUpFormInitialized: HookType = () => {
  // フォームの初期値、バリデーションを設定
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
