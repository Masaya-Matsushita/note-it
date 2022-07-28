import { NumberInput } from '@mantine/core'
import { NoteFormAction } from 'pages/my-page/[uid]/[badgeId]/[bookId]/note-form'
import { Dispatch, FC, memo } from 'react'

type Props = {
  page: number
  dispatch: Dispatch<NoteFormAction>
}
// eslint-disable-next-line react/display-name
export const PageInput: FC<Props> = memo(({ page, dispatch }) => {
  return (
    <NumberInput
      min={1}
      required
      label='Page'
      size='md'
      value={page}
      onChange={(val) => dispatch({ type: 'page', page: val })}
      className='w-20'
    />
  )
})
