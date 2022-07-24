import { InputForm } from 'components/BookForm/InputForm'
import { ToBackLink } from 'components/Parts/ToBackLink'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

const BookForm: NextPage = () => {
  const router = useRouter()
  const uid = router.query.uid

  return (
    <div className='mx-auto max-w-xl'>
      <InputForm router={router} uid={String(uid)} />
      <ToBackLink text='Home' href={`/my-page/${uid}`} />
    </div>
  )
}

export default BookForm
