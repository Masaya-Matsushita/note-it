import { Textarea } from '@mantine/core'
import { Dispatch, FC, SetStateAction } from 'react'

type Props = {
  note: string
  cloze: boolean
  dispatch: Dispatch<any>
}

export const NoteInput: FC<Props> = ({ note, cloze, dispatch }) => {
  return (
    <Textarea
      required
      label='Note'
      placeholder='炭酸水素ナトリウムを試験管に入れ、ガスバーナーで加熱すると、水と二酸化炭素が発生し、炭酸ナトリウムが残る。'
      size='md'
      value={note}
      onChange={(e) => dispatch({ type: 'note', note: e.target.value })}
      error={note.length > 500 ? '500文字以内で入力してください。' : null}
      disabled={cloze}
      description={
        cloze ? '編集する場合は「括弧抜きを追加」をoffにしてください。' : ''
      }
      className='mt-4'
      classNames={{ input: 'h-32' }}
    />
  )
}
