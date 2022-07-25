import { NumberInput } from '@mantine/core'
import { Dispatch, FC, SetStateAction } from 'react'

type Props = {
  page: number
  dispatch: Dispatch<any>
}
export const PageInput: FC<Props> = ({ page, dispatch }) => {
  return (
    <NumberInput
      min={0}
      required
      label='Page'
      placeholder='26'
      size='md'
      value={page}
      onChange={(val) => dispatch({ type: 'page', page: val })}
      className='w-20'
    />
  )
}
