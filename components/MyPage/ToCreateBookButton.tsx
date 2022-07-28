import { Button } from '@mantine/core'
import { useRouter } from 'next/router'
import { memo } from 'react'
import { Plus } from 'tabler-icons-react'

// eslint-disable-next-line react/display-name
export const ToCreateBookButton = memo(() => {
  const router = useRouter()
  const uid = String(router.query.uid)

  // ブラウザのtargetBookを空にしてbook-formページへ移動
  const toBookForm = () => {
    const emptyTargetBook = { badge: '', title: '', overview: '' }
    sessionStorage.setItem('targetBook', JSON.stringify(emptyTargetBook))
    router.push(`/my-page/${uid}/book-form`)
  }

  return (
    <Button
      className='sticky bottom-16 left-full mr-2 w-16 h-16 rounded-full'
      compact
      onClick={() => toBookForm()}
    >
      <Plus size={48} />
    </Button>
  )
})
