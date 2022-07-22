import { TextInput } from '@mantine/core'
import { Dispatch, FC, SetStateAction } from 'react'

type Props = {
  label: string
  setLabel: Dispatch<SetStateAction<string>>
}

export const LabelInput:FC<Props> = ({ label, setLabel }) => {
  return (
    <TextInput
      required
      label='Label'
      placeholder='（ 例 ）炭酸水素ナトリウムの熱分解'
      size='md'
      value={label}
      onChange={(e) => setLabel(e.target.value)}
      error={label.length > 50 ? '50文字以内で入力してください。' : null}
      className='flex-1 mr-4 xs:mr-6'
    />
  )
}
