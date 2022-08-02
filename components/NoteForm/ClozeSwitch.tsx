import { Switch } from '@mantine/core'
import { NoteFormAction } from 'pages/my-page/[uid]/[badgeId]/[bookId]/note-form'
import { Dispatch, FC, memo } from 'react'

type Props = {
  cloze: boolean
  dispatch: Dispatch<NoteFormAction>
}

// eslint-disable-next-line react/display-name
export const ClozeSwitch: FC<Props> = memo(({ cloze, dispatch }) => {
  return (
    <div className='flex justify-end'>
      <Switch
        label='括弧抜きを追加'
        size='md'
        checked={cloze}
        onChange={(e) => {
          dispatch({
            type: 'toggleClozeSwitch',
            cloze: e.target.checked,
            opened: e.target.checked,
          })
        }}
        className='mt-4 mr-4 hover:cursor-pointer'
      />
    </div>
  )
})
