import { Button, Card } from '@mantine/core'
import { FC } from 'react'
import { Notes } from 'types'

type Props = {
  notes: Notes
}

export const NoteList: FC<Props> = ({ notes }) => {
  return (
    <div>
      <div className='mb-1 ml-4 text-2xl font-semibold'>Notes</div>
      <div className='grow mx-2 border border-dark-400 border-solid'></div>
      <Button
        className='block mt-4 mr-6 mb-3 ml-auto w-28 h-6 text-dark-200 xs:mr-10 xs:h-8 md:w-40'
        variant='default'
        color='gray'
      >
        + 追加
      </Button>
      {/* <div className='flex justify-between my-2'>
            <div className='ml-6 text-sm text-dark-300'>Label</div>
            <div className='mr-8 text-sm text-dark-300'>Page</div>
          </div> */}
      {notes.map((note) => {
        return (
          <Card
            className='group p-2 mx-4 mb-4 hover:bg-dark-600 hover:cursor-pointer xs:mx-8 md:p-4'
            key={note.id}
          >
            <div className='flex justify-between md:ml-2 md:text-lg'>
              <div className='ml-4'>{note.label}</div>
              <div className='py-1 px-2 mr-4 text-dark-200 bg-dark-800 group-hover:bg-dark-700 rounded-md'>
                {note.page}
              </div>
            </div>
          </Card>
        )
      })}
      <Card className='py-1 mx-4 text-sm font-semibold text-center text-dark-200 bg-dark-700 hover:bg-dark-600 hover:cursor-pointer xs:py-2 xs:mx-8 xs:text-base'>
        + 追加
      </Card>
    </div>
  )
}
