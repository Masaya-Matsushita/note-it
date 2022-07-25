import { TextInput } from '@mantine/core'
import { Dispatch, FC, SetStateAction } from 'react'

type Props = {
  label: string
  dispatch: Dispatch<any>
}

export const LabelInput: FC<Props> = ({ label, dispatch }) => {
  return (
    <TextInput
      required
      label='Label'
      placeholder='（ 例 ）炭酸水素ナトリウムの熱分解'
      size='md'
      value={label}
      onChange={(e) => dispatch({ type: 'label', label: e.target.value })}
      error={label.length > 50 ? '50文字以内で入力してください。' : null}
      className='flex-1 mr-4 xs:mr-6'
    />
  )
}
