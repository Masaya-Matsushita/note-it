import { Button, Chip, Chips, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Book2, Check } from 'tabler-icons-react'
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

const BookForm: NextPage = () => {
  const router = useRouter()

  // formの初期値を定義
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      title: '',
      chips: '1,学校',
      overview: '',
    },
  })

  // badge,bookをデータベースに登録
  const addBook = async (values: {
    title: string
    chips: string
    overview: string
  }) => {
    const user = auth.currentUser
    if (user) {
      // badgeを登録
      const chipsArray = values.chips.split(',')
      await setDoc(doc(db, 'users', user.uid, 'badges', chipsArray[1]), {
        priority: Number(chipsArray[0]),
        badge: chipsArray[1],
      })
      // bookを登録
      await addDoc(
        collection(db, 'users', user.uid, 'badges', chipsArray[1], 'books'),
        {
          title: values.title,
          overview: values.overview,
        }
      )
      // 登録後、ページ遷移
      showNotification({
        message: '登録完了！',
        autoClose: 3000,
        icon: <Check size={20} />,
      })
      router.push(`/my-page/${user.uid}`)
    }
  }

  return (
    <div className='mx-auto max-w-xl'>
      <div className='ml-2 max-w-lg text-3xl'>Book登録</div>
      <div>
        <form onSubmit={form.onSubmit((values) => addBook(values))}>
          <div className='p-4 py-6 mt-3 mb-6 rounded-md border-dark-600 border-solid xs:px-6'>
            <TextInput
              required
              label='Title'
              placeholder='タイトル(必須)'
              size='md'
              {...form.getInputProps('title')}
            />
            <div className='mt-4 mb-2 font-medium'>Badge</div>
            <Chips {...form.getInputProps('chips')}>
              <Chip value='1,学校'>学校</Chip>
              <Chip value='2,試験'>試験</Chip>
              <Chip value='3,研究'>研究</Chip>
              <Chip value='4,資格'>資格</Chip>
              <Chip value='5,研鑽'>研鑽</Chip>
              <Chip value='6,教養'>教養</Chip>
              <Chip value='7,趣味'>趣味</Chip>
              <Chip value='8,その他'>その他</Chip>
            </Chips>
            <Textarea
              label='Overview'
              placeholder='概要、メモなど'
              size='md'
              {...form.getInputProps('overview')}
              className='mt-4 mb-1'
            />
          </div>
          <div className='mx-4'>
            <Button
              type='submit'
              className='w-full h-10 text-base'
              leftIcon={<Book2 size={18} />}
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
