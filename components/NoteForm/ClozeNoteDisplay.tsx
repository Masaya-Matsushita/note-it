import { Card } from '@mantine/core'
import { FC, memo } from 'react'

type Props = { clozeNote: string; isShow: boolean }

// eslint-disable-next-line react/display-name
export const ClozeNoteDisplay: FC<Props> = memo(({ clozeNote, isShow }) => {
  if (!isShow) {
    return <div></div>
  }

  return (
    <div>
      <div className='mb-2 text-sm font-semibold'>括弧抜き</div>
      <Card className='mb-4 min-h-[100px]'>{clozeNote}</Card>
    </div>
  )
})
