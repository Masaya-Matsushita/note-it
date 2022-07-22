import { useForm, zodResolver } from '@mantine/form'
import { z } from 'zod'

// formのバリデーションを定義
const schema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: '2~50文字で入力してください。' })
    .max(50, { message: '2~50文字で入力してください。' }),
  chips: z.string(),
  overview: z
    .string()
    .trim()
    .max(200, { message: '200文字以内で入力してください。' }),
})

export const useBookFormInitialized = () => {
  // formの初期値を定義
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      title: '',
      chips: '1,学校',
      overview: '',
    },
  })
  return form
}
