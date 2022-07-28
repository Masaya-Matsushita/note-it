import { TextInput } from '@mantine/core'
import { NoteFormAction } from 'pages/my-page/[uid]/[badgeId]/[bookId]/note-form'
import { Dispatch, FC, memo } from 'react'

type Props = {
  label: string
  dispatch: Dispatch<NoteFormAction>
}

// eslint-disable-next-line react/display-name
export const LabelInput: FC<Props> = memo(({ label, dispatch }) => {
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
})
