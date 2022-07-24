import { z } from 'zod'
import { useForm, zodResolver } from '@mantine/form'

// フォームのバリデーションを定義
const signUpShema = z.object({
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

export const useFormInitialized = () => {
  // フォームの初期値、バリデーションを設定
  const signUpForm = useForm({
    schema: zodResolver(signUpShema),
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const emailForm = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : 'メールアドレスが正しくありません。',
    },
  })

  return { signUpForm, emailForm }
}
