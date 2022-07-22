import { Switch } from '@mantine/core'
import { Dispatch, FC, SetStateAction } from 'react'

type Props = {
  cloze: boolean
  setCloze: Dispatch<SetStateAction<boolean>>
  setOpened: Dispatch<SetStateAction<boolean>>
  setShowClozeNote: Dispatch<SetStateAction<boolean>>
}

export const ClozeSwitch: FC<Props> = ({
  cloze,
  setCloze,
  setOpened,
  setShowClozeNote,
}) => {
  return (
    <div className='flex justify-end'>
      <Switch
        label='括弧抜きを追加'
        size='md'
        checked={cloze}
        onChange={(e) => {
          setCloze(e.target.checked)
          setOpened(e.target.checked)
          setShowClozeNote(false)
        }}
        className='mt-4 mr-4 hover:cursor-pointer'
      />
    </div>
  )
}
