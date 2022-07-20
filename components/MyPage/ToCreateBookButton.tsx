import { Button } from '@mantine/core'
import { auth } from 'firebaseConfig/firebase'
import { NextRouter } from 'next/router'
import { FC } from 'react'
import { Plus } from 'tabler-icons-react'

type Props = {
  router: NextRouter
}

export const ToCreateBookButton: FC<Props> = ({ router }) => {
  const toBookForm = () => {
    const user = auth.currentUser
    if (user) {
      router.push(`/my-page/${user.uid}/book-form`)
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
