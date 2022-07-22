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
import { Ballpen, Check, Note } from 'tabler-icons-react'
import { BsArrowCounterclockwise } from 'react-icons/bs'
import { Book } from 'types'

const NoteForm: NextPage = () => {
  const router = useRouter()
  const [targetBook, setTargetBook] = useState<Book | undefined>()
  const [opened, setOpened] = useState(true)
  const [popover, setPopover] = useState(false)
  const [label, setLabel] = useState('')
  const [page, setPage] = useState(0)
  const [note, setNote] = useState('')
  const [cloze, setCloze] = useState(false)
  const [showClozeNote, setShowClozeNote] = useState(false)
  const [clozeNote, setClozeNote] = useState('')
  const [clozeList, setClozeList] = useState<
    {
      start: number
      range: number
    }[]
  >([])
  const [clozeListIndex, setClozeListIndex] = useState(0)

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
          cloze: Boolean(cloze)
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

  useEffect(() => {
    if (cloze) {
      setClozeNote(note)
    } else {
      setClozeNote('')
      setClozeList([])
      setClozeListIndex(0)
    }
  }, [cloze])

  const resetClozeList = () => {
    if (clozeList.length) {
      setClozeNote(note)
      setClozeList([])
      setClozeListIndex(0)
    }
  }

  const pushClozeList = () => {
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
        setClozeListIndex(clozeList.length)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (clozeList.length) {
      updateClozeNote()
    }
  }, [clozeList])

  const updateClozeNote = () => {
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
        className='mt-24'
      >
        <div className='mb-2 text-xl'>括弧抜きを追加</div>
        <div className='grow mb-2 border border-dark-400 border-solid'></div>
        <div className='p-2'>
          <div className=' mt-[3px] text-dark-300'>
            追加後はnoteの編集が行えません。先にnoteの編集を完了させてください。
          </div>
          <Popover
            opened={popover}
            onClose={() => setPopover(false)}
            target={
              <div
                onClick={() => setPopover((prev) => !prev)}
                className='mb-2 text-dark-300 underline hover:cursor-pointer'
              >
                ？ 追加方法
              </div>
            }
            width={260}
            placement='end'
            position='top'
            className='block ml-[150px] text-right xxs:ml-40 xs:ml-72'
            classNames={{popover: 'border-dark-500 border-solid'}}
            withArrow
          >
            <Stepper orientation='vertical' active={0}>
              <Stepper.Step label='note の括弧抜きする範囲を選択' />
              <Stepper.Step label='「括弧抜きする」をクリック' />
              <Stepper.Step label='複数作成したい場合は１, 2 を繰り返し' />
            </Stepper>
          </Popover>
          <div className='ml-2 text-dark-200'>Note</div>
          <Card className='mb-4 min-h-[120px]'>{clozeNote}</Card>
          <div className='flex justify-center mb-12'>
            <Button
              leftIcon={<BsArrowCounterclockwise />}
              onClick={() => resetClozeList()}
              className='mr-2 text-dark-100 bg-dark-500 hover:bg-dark-600'
            >
              リセット
            </Button>
            <Button
              onClick={() => pushClozeList()}
              className='ml-2 text-dark-100 bg-dark-500 hover:bg-dark-600'
            >
              括弧抜きする
            </Button>
          </div>
          <div className='flex justify-between'>
            <Button
              color='red'
              onClick={() => {
                setCloze(false)
                setOpened(false)
              }}
              className='flex-1 mr-2'
            >
              Cansel
            </Button>
            <Button
              leftIcon={<Ballpen size={18} />}
              onClick={() => {
                setShowClozeNote(true)
                setOpened(false)
              }}
              className='flex-1 mr-2'
            >
              OK
            </Button>
          </div>
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
          disabled={cloze}
          description={
            cloze
              ? 'もう一度編集する場合は、「括弧抜きを追加」をoffにしてください。'
              : ''
          }
          className='mt-4'
          classNames={{ input: 'h-32' }}
        />
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
        {showClozeNote ? (
          <div>
            <div className='mb-2 text-sm font-semibold'>括弧抜き</div>
            <Card className='mb-4 min-h-[100px]'>{clozeNote}</Card>
          </div>
        ) : null}
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
