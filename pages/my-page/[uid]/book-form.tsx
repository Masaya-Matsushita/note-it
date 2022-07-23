import { InputForm } from 'components/BookForm/InputForm'
import { ToBackLink } from 'components/Parts/ToBackLink'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { useFormInitialized } from 'hooks/useFormInitialized'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const BookForm: NextPage = () => {
  const router = useRouter()
  const { bookForm } = useFormInitialized()
  const [uid, setUid] = useState('')

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid)
      }
    })
  }, [])

  return (
    <div className='mx-auto max-w-xl'>
      <div className='ml-2 max-w-lg text-3xl'>Book登録</div>
      <InputForm bookForm={bookForm} router={router} />
      <ToBackLink text='Home' href={`/my-page/${uid}`} />
    </div>
  )
}

export default BookForm
