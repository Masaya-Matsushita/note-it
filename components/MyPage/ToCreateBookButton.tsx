import { Button } from '@mantine/core'
import { Plus } from 'tabler-icons-react'

export const ToCreateBookButton = () => {
  return (
    <Button
      className='sticky bottom-0 left-full mr-2 w-16 h-16 rounded-full'
      compact
      onClick={() => console.log('hello')}
    >
      <Plus size={48} />
    </Button>
  )
}
