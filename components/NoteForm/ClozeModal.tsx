import { Modal, Popover, Stepper, Card, Button } from '@mantine/core'
import { Dispatch, FC, useState } from 'react'
import { BsArrowCounterclockwise } from 'react-icons/bs'

type Props = {
  clozeNote: string
  opened: boolean
  note: string
  dispatch: Dispatch<any>
}

export const ClozeModal: FC<Props> = ({
  clozeNote,
  opened,
  note,
  dispatch,
}) => {
  const [popover, setPopover] = useState(false)

  // 選択範囲を括弧抜きする
  const updateClozeNote = () => {
    try {
      const selectObj = window.getSelection()?.getRangeAt(0)
      if (selectObj) {
        // 選択範囲を取得
        const selectStart = selectObj.startOffset
        const selectRange = selectObj.endOffset - selectObj.startOffset
        // 括弧を作成
        const blank = Array(selectRange)
        blank.fill('＿')
        // 選択範囲を括弧へ置き換え
        let clozeNoteArr = clozeNote.split('')
        clozeNoteArr.splice(
          selectStart,
          selectRange,
          ' ',
          '(',
          ' ',
          blank.join(''),
          ' ',
          ')',
          ' '
        )
        dispatch({ type: 'clozeNote', clozeNote: clozeNoteArr.join('') })
      }
    } catch (error) {
      // 範囲選択されていないとき
      console.error(error)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={() => dispatch({ type: 'opened', opened: false })}
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      className='mt-20'
    >
      <div className='mb-2 text-xl'>括弧抜きを追加</div>
      <div className='grow mb-2 border border-dark-400 border-solid'></div>
      <div className='p-2'>
        <div className='mt-[3px] text-dark-300'>
          追加後はNoteの編集が行えません。先にNoteの編集を完了させてください。
        </div>
        <div className='ml-1 text-sm text-dark-300'>
          ※ iPhoneの場合は、利用できません。
        </div>
        <Popover
          opened={popover}
          onClose={() => setPopover(false)}
          trapFocus={false}
          target={
            <div
              onMouseEnter={() => setPopover(true)}
              onMouseLeave={() => setPopover(false)}
              className='mb-2 text-dark-300 underline hover:cursor-pointer'
            >
              ？ 追加方法
            </div>
          }
          width={260}
          placement='end'
          position='top'
          className='block text-right xs:ml-72'
          classNames={{
            popover: 'border-dark-500 border-solid',
            target: 'w-24 ml-auto',
            body: 'p-0',
          }}
          withArrow
        >
          <Stepper orientation='vertical' active={0}>
            <Stepper.Step label='Note の括弧抜きする範囲を選択' />
            <Stepper.Step label='「選択範囲を括弧抜き」をクリック' />
            <Stepper.Step label='複数作成したい場合は１, 2 を繰り返し' />
          </Stepper>
        </Popover>
        <div className='ml-2 text-dark-200'>Note</div>
        <Card className='mb-4 min-h-[120px]'>{clozeNote}</Card>
        <div className='flex items-center mb-12'>
          <Button
            leftIcon={<BsArrowCounterclockwise />}
            onClick={() => dispatch({ type: 'clozeNote', clozeNote: note })}
            className='flex-1 mx-2 text-dark-100 bg-dark-500 hover:bg-dark-600'
          >
            リセット
          </Button>
          <Button
            onClick={() => updateClozeNote()}
            className='flex-1 mx-2 text-dark-100 bg-dark-500 hover:bg-dark-600'
          >
            選択範囲を括弧抜き
          </Button>
        </div>
        <div className='flex items-center'>
          <Button
            color='red'
            onClick={() => {
              dispatch({
                type: 'cancelClozeModal',
                cloze: false,
                opened: false,
              })
            }}
            className='flex-1 mr-2'
          >
            Cansel
          </Button>
          <Button
            onClick={() => {
              dispatch({
                type: 'okClozeModal',
                showClozeNote: true,
                opened: false,
              })
            }}
            className='flex-1 mr-2'
          >
            追加
          </Button>
        </div>
      </div>
    </Modal>
  )
}
