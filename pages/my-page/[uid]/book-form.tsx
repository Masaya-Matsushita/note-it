import { InputForm } from 'components/BookForm/InputForm'
import { ToBackLink } from 'components/Parts/ToBackLink'
import { useBookFormState } from 'hooks/StateManagement/useBookFormState'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const BookForm: NextPage = () => {
  const router = useRouter()
  const uid = router.query.uid
  const { state, dispatch } = useBookFormState()

  useEffect(() => {
    const jsonTargetBook = sessionStorage.getItem('targetBook')
    if (jsonTargetBook) {
      const targetBook = JSON.parse(jsonTargetBook)
      if (targetBook.title !== '') {
        dispatch({
          type: 'set',
          title: targetBook.title,
          badge: targetBook.badge,
          overview: targetBook.overview,
        })
      }
    }
  }, [])

  return (
    <div className='mx-auto max-w-xl'>
      <div className='ml-2 max-w-lg text-3xl'>Book登録</div>
      <InputForm router={router} state={state} dispatch={dispatch} />
      <ToBackLink text='Home' href={`/my-page/${uid}`} />
    </div>
  )
}

export default BookForm
