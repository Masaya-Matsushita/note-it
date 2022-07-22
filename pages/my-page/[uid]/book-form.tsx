import { InputForm } from 'components/BookForm/InputForm'
import { useBookFormInitialized } from 'hooks/useBookFormInitialized'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

const BookForm: NextPage = () => {
  const router = useRouter()
  const form = useBookFormInitialized()

  return (
    <div className='mx-auto max-w-xl'>
      <div className='ml-2 max-w-lg text-3xl'>Book登録</div>
      <InputForm form={form} router={router} />
    </div>
  )
}

export default BookForm
