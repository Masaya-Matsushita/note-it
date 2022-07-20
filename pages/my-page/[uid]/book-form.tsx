import { Button, Chip, Chips, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Book2, Check } from 'tabler-icons-react'
import { z } from 'zod'

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

const BookForm: NextPage = () => {
  const router = useRouter()
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      title: '',
      chips: '学校',
      overview: '',
    },
  })

  const setBook = async (values: {
    title: string
    chips: string
    overview: string
  }) => {
    const user = auth.currentUser
    if (user) {
      await setDoc(doc(db, 'users', user.uid, 'badges', values.chips), {
        badge: values.chips,
      })
      await addDoc(
        collection(db, 'users', user.uid, 'badges', values.chips, 'books'),
        {
          title: values.title,
          overview: values.overview,
        }
      )
      showNotification({
        message: '登録しました！',
        autoClose: 3000,
        icon: <Check size={20} />,
      })
      router.push(`/my-page/${user.uid}`)
    }
  }

  return (
    <div className='mx-auto max-w-lg'>
      <div className='ml-2 max-w-lg text-2xl'>Book登録</div>
      <div>
        <form onSubmit={form.onSubmit((values) => setBook(values))}>
          <div className='px-2 pt-4 pb-6 my-6 rounded-md border-dark-500 border-solid xs:px-4'>
            <TextInput
              required
              label='Title'
              placeholder='タイトル(必須)'
              {...form.getInputProps('title')}
            />
            <div className='mt-4 mb-1 text-sm font-medium'>Badge</div>
            <Chips {...form.getInputProps('chips')}>
              <Chip value='学校'>学校</Chip>
              <Chip value='試験'>試験</Chip>
              <Chip value='研究'>研究</Chip>
              <Chip value='資格'>資格</Chip>
              <Chip value='研鑽'>研鑽</Chip>
              <Chip value='教養'>教養</Chip>
              <Chip value='趣味'>趣味</Chip>
              <Chip value='その他'>その他</Chip>
            </Chips>
            <Textarea
              label='Overview'
              placeholder='概要、メモなど'
              {...form.getInputProps('overview')}
              className='mt-4 mb-1'
            />
          </div>
          <div className='mx-4'>
            <Button
              type='submit'
              className='w-full'
              leftIcon={<Book2 size={16} strokeWidth={1.5} />}
            >
              登録
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookForm
