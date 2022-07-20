import { Button, NumberInput, Switch, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { addDoc, collection } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Check, Note } from 'tabler-icons-react'
import { Book } from 'types'
import { z } from 'zod'

const schema = z.object({
  label: z
    .string()
    .trim()
    .min(2, { message: '2~50文字で入力してください。' })
    .max(50, { message: '2~50文字で入力してください。' }),
  page: z.number().min(0),
  note: z
    .string()
    .trim()
    .max(500, { message: '500文字以内で入力してください。' }),
  cloze: z.boolean(),
})

const NoteForm: NextPage = () => {
  const router = useRouter()
  const [targetBook, setTargetBook] = useState<Book | undefined>()
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      label: '',
      page: 0,
      note: '',
      cloze: false,
    },
  })

  useEffect(() => {
    const jsonTargetBook = sessionStorage.getItem('targetBook')
    if (jsonTargetBook) {
      setTargetBook(JSON.parse(jsonTargetBook))
    }
  }, [])

  const setNote = async (values: {
    label: string
    page: number
    note: string
    cloze: boolean
  }) => {
    const user = auth.currentUser
    if (user && targetBook) {
      await addDoc(
        collection(
          db,
          'users',
          user.uid,
          'badges',
          targetBook.badge,
          'books',
          targetBook.bookId,
          'notes'
        ),
        {
          label: values.label,
          page: values.page,
          note: values.note,
        }
      )
      showNotification({
        message: '作成完了！',
        autoClose: 3000,
        icon: <Check size={20} />,
      })
      router.push(`/my-page/${user.uid}/${targetBook.bookId}`)
    }
  }

  return (
    <div className='mx-auto max-w-lg'>
      <div className='ml-2 max-w-lg text-3xl'>Note作成</div>
      <div className='mt-2 ml-4 text-dark-400'>- {targetBook?.title}</div>
      <div>
        <form onSubmit={form.onSubmit((values) => setNote(values))}>
          <div className='py-8 px-4 mt-6 mb-8 rounded-md border-dark-600 border-solid xs:px-10'>
            <div className='flex mr-4'>
              <TextInput
                required
                label='Label'
                placeholder='ラベル(必須)'
                size='md'
                {...form.getInputProps('label')}
                className='flex-1 mr-4 xs:mr-6'
              />
              <NumberInput
                min={0}
                required
                label='Page'
                placeholder='0'
                size='md'
                {...form.getInputProps('page')}
                className='w-20'
              />
            </div>
            <Textarea
              required
              label='Note'
              placeholder='必須'
              size='md'
              {...form.getInputProps('note')}
              className='mt-4'
              classNames={{ input: 'h-32' }}
            />
            <div className='flex justify-end'>
              <Switch
                label='括弧抜きを作成'
                size='md'
                className='mt-4 mr-4 hover:cursor-pointer'
                {...form.getInputProps('cloze')}
              />
            </div>
          </div>
          <div className='mx-4'>
            <Button
              type='submit'
              className='w-full h-10 text-base'
              leftIcon={<Note size={18} />}
            >
              作成
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NoteForm
