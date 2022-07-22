import { NumberInput } from "@mantine/core"
import { Dispatch, FC, SetStateAction } from 'react'

type Props = {
  page: number
  setPage: Dispatch<SetStateAction<number>>
}
export const PageInput:FC<Props> = ({page, setPage}) => {
  return (
    <NumberInput
      min={0}
      required
      label='Page'
      placeholder='26'
      size='md'
      value={page}
      onChange={(num) => (num ? setPage(num) : null)}
      className='w-20'
    />
  )
}
