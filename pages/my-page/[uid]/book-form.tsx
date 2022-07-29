import { InputForm } from 'components/BookForm/InputForm'
import { BreadCrumbs } from 'components/Parts/BreadCrumbs'
import { ToBackLink } from 'components/Parts/ToBackLink'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

const BookForm: NextPage = () => {
  const router = useRouter()
  const uid = String(router.query.uid)

  return (
    <div className='mx-auto max-w-xl'>
      <BreadCrumbs page='book-form' uid={uid} />
      <InputForm router={router} uid={uid} />
      <ToBackLink text='Home' href={`/my-page/${uid}`} />
    </div>
  )
}

export default BookForm
