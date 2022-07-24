import { Button } from '@mantine/core'
import { NextRouter } from 'next/router'
import { FC } from 'react'
import { Plus } from 'tabler-icons-react'

type Props = {
  router: NextRouter
}

export const ToCreateBookButton: FC<Props> = ({ router }) => {
  const uid = router.query.uid

  // ブラウザのtargetBookを空にしてbook-formページへ移動
  const toBookForm = () => {
    if (typeof uid === 'string') {
      const emptyTargetBook = { badge: '', title: '', overview: '' }
      sessionStorage.setItem('targetBook', JSON.stringify(emptyTargetBook))
      router.push(`/my-page/${uid}/book-form`)
    }
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
}
