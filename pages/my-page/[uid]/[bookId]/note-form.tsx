import {
  Button,
  NumberInput,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Book2 } from 'tabler-icons-react'
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
})

const NoteForm: NextPage = () => {
  const router = useRouter()
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      label: '',
      page: '0',
      note: '',
    },
  })

  return (
    <div className='mx-auto max-w-lg'>
      <div className='ml-2 max-w-lg text-2xl'>Note作成</div>
      <div className='mt-1 ml-4 text-sm text-dark-400'>
        # {router.query.book}
      </div>
      <div>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <div className='px-2 pt-4 pb-6 mt-3 mb-6 rounded-md border-dark-500 border-solid xs:px-4'>
            <div className='flex mr-4'>
              <TextInput
                required
                label='Label'
                placeholder='ラベル(必須)'
                {...form.getInputProps('label')}
                className='flex-1 mr-8'
              />
              <NumberInput
                min={0}
                required
                label='Page'
                placeholder='0'
                {...form.getInputProps('page')}
                className='w-20'
              />
            </div>
            <Textarea
              required
              label='Note'
              placeholder='必須'
              {...form.getInputProps('note')}
              className='mt-4'
            />
          </div>
          <div className='mx-4'>
            <Button
              type='submit'
              className='w-full'
              leftIcon={<Book2 size={16} strokeWidth={1.5} />}
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
