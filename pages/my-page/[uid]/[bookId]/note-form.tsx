import {
  Button,
  Card,
  Modal,
  NumberInput,
  Popover,
  Stepper,
  Switch,
  Textarea,
  TextInput,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { addDoc, collection } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Check, Note } from 'tabler-icons-react'
import { BsArrowCounterclockwise } from 'react-icons/bs'
import { Book } from 'types'

const NoteForm: NextPage = () => {
  const router = useRouter()
  const [targetBook, setTargetBook] = useState<Book | undefined>()
  const [label, setLabel] = useState('')
  const [page, setPage] = useState(0)
  const [note, setNote] = useState('')
  const [clozeNote, setClozeNote] = useState('')
  const [opened, setOpened] = useState(true)
  const [popover, setPopover] = useState(false)

  //マウント時にsessionStorageからデータを取得
  useEffect(() => {
    const jsonTargetBook = sessionStorage.getItem('targetBook')
    if (jsonTargetBook) {
      setTargetBook(JSON.parse(jsonTargetBook))
    }
  }, [])

  // noteをデータベースに登録
  const addNote = async () => {
    const user = auth.currentUser
    if (user && targetBook && label.length <= 50 && note.length <= 500) {
      await addDoc(
        collection(
          db,
          'users',
          user.uid,
          'badges',
          targetBook.badge,
          'books',
          targetBook.bookId,
          'notes'
        ),
        {
          label: String(label),
          page: Number(page),
          note: String(note),
        }
      )
      // 登録後、ページ遷移
      showNotification({
        message: '作成完了！',
        autoClose: 3000,
        icon: <Check size={20} />,
      })
      router.push(`/my-page/${user.uid}/${targetBook.bookId}`)
    }
  }

  const [clozeList, setClozeList] = useState<
    {
      start: number
      range: number
    }[]
  >([])
  const [clozeListIndex, setClozeListIndex] = useState(0)

  useEffect(() => {
    if (opened) {
      setClozeNote(note)
    } else {
      setClozeNote('')
    }
  }, [opened])

  const createClozeList = () => {
    try {
      const selectedRange = window.getSelection()?.getRangeAt(0)
      if (selectedRange) {
        setClozeList((prev) => {
          return [
            ...prev,
            {
              start: selectedRange.startOffset,
              range: selectedRange.endOffset - selectedRange.startOffset,
            },
          ]
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (clozeList.length) {
      patchCloze()
    }
  }, [clozeList])

  const patchCloze = () => {
    let clozeNoteArr = clozeNote.split('')
    const blank = Array(clozeList[clozeListIndex].range)
    blank.fill('＿')
    clozeNoteArr.splice(
      clozeList[clozeListIndex].start,
      clozeList[clozeListIndex].range,
      ' ',
      '(',
      ' ',
      blank.join(''),
      ' ',
      ')',
      ' '
    )
    setClozeListIndex((prev) => prev + 1)
    setClozeNote(clozeNoteArr.join(''))
  }

  return (
    <div className='mx-auto max-w-xl'>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        className='mt-48'
      >
        <div className='text-lg'>括弧抜きを作成</div>
        <Popover
          opened={popover}
          onClose={() => setPopover(false)}
          trapFocus={false}
          target={
            <div
              className='block mb-4 ml-[300px] text-dark-300 underline hover:cursor-pointer'
              onMouseEnter={() => setPopover(true)}
              onMouseLeave={() => setPopover(false)}
            >
              ？ 作成方法
            </div>
          }
          width={260}
          placement='end'
          position='top'
          withArrow
        >
          <Stepper orientation='vertical' active={0}>
            <Stepper.Step label='note の括弧抜きする範囲を選択' />
            <Stepper.Step label='「括弧抜きする」をクリック' />
            <Stepper.Step label='複数作成したい場合は１, 2 を繰り返し' />
          </Stepper>
        </Popover>
        <Card className='mb-2 min-h-[100px]'>{clozeNote}</Card>
        <div className='flex justify-center mb-8'>
          <Button
            className='mr-2 h-8 text-dark-100 bg-dark-500'
            leftIcon={<BsArrowCounterclockwise />}
          >
            1つ戻す
          </Button>
          <Button
            onClick={() => createClozeList()}
            className='ml-2 h-8 text-dark-100 bg-dark-500'
          >
            括弧抜きする
          </Button>
        </div>
        <div className='flex justify-between'>
          <Button
            color='red'
            onClick={() => setOpened(false)}
            className='flex-1 mr-2'
          >
            Cansel
          </Button>
          <Button leftIcon={<Note size={18} />} className='flex-1 mr-2'>
            完了
          </Button>
        </div>
      </Modal>
      <div className='ml-2 max-w-lg text-3xl'>Note作成</div>
      <div className='mt-2 ml-4 text-dark-400'>- {targetBook?.title}</div>
      <div className='py-8 px-4 mt-6 mb-8 rounded-md border-dark-600 border-solid xs:px-6'>
        <div className='flex mr-4'>
          <TextInput
            required
            label='Label'
            placeholder='ラベル(必須)'
            size='md'
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            error={label.length > 50 ? '50文字以内で入力してください。' : null}
            className='flex-1 mr-4 xs:mr-6'
          />
          <NumberInput
            min={0}
            required
            label='Page'
            placeholder='0'
            size='md'
            value={page}
            onChange={(num) => (num ? setPage(num) : null)}
            className='w-20'
          />
        </div>
        <Textarea
          required
          label='Note'
          placeholder='必須'
          size='md'
          value={note}
          onChange={(e) => setNote(e.target.value)}
          error={note.length > 500 ? '500文字以内で入力してください。' : null}
          className='mt-4'
          classNames={{ input: 'h-32' }}
        />
        <div className='flex justify-end'>
          <Switch
            label='括弧抜きを作成'
            size='md'
            checked={opened}
            onChange={(e) => setOpened(e.currentTarget.checked)}
            className='mt-4 mr-4 hover:cursor-pointer'
          />
        </div>
      </div>
      <div className='mx-4'>
        <Button
          className='w-full h-10 text-base'
          leftIcon={<Note size={18} />}
          onClick={() => addNote()}
        >
          作成
        </Button>
      </div>
    </div>
  )
}

export default NoteForm
