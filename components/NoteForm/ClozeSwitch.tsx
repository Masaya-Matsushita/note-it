import { Switch } from '@mantine/core'
import { Dispatch, FC, SetStateAction } from 'react'

type Props = {
  cloze: boolean
  dispatch: Dispatch<any>
}

export const ClozeSwitch: FC<Props> = ({ cloze, dispatch }) => {
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
            setShowClozeNote: false,
          })
        }}
        className='mt-4 mr-4 hover:cursor-pointer'
      />
    </div>
  )
}
