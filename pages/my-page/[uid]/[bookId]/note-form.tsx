import {
  Button,
  Modal,
  NumberInput,
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
import { Book } from 'types'

const NoteForm: NextPage = () => {
  const router = useRouter()
  const [targetBook, setTargetBook] = useState<Book | undefined>()
  const [label, setLabel] = useState('')
  const [page, setPage] = useState(0)
  const [note, setNote] = useState('')
  const [opened, setOpened] = useState(false)

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

  // const [str, setStr] = useState(
  //   'ドキュメントに有効な ID がなく、Cloud Firestore が ID を自動的に生成するように設定したほうが都合のよい場合もあります。'
  // )
  // const [blazeList, setBlazeList] = useState<
  //   {
  //     start: number
  //     range: number
  //   }[]
  // >([])
  // const [blazeListIndex, setBlazeListIndex] = useState(0)

  // const createBlazeList = () => {
  //   try {
  //     const selObj = window.getSelection()?.getRangeAt(0)
  //     if (selObj) {
  //       setBlazeList((prev) => {
  //         return [
  //           ...prev,
  //           {
  //             start: selObj.startOffset,
  //             range: selObj.endOffset - selObj.startOffset,
  //           },
  //         ]
  //       })
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // useEffect(() => {
  //   if (blazeList.length) {
  //     displayStr()
  //   }
  // }, [blazeList])

  // const displayStr = () => {
  //   let strArray = str.split('')
  //   const underberArray = Array(blazeList[blazeListIndex].range)
  //   underberArray.fill('＿')
  //   const underber = underberArray.join('')
  //   strArray.splice(
  //     blazeList[blazeListIndex].start,
  //     blazeList[blazeListIndex].range,
  //     ' ',
  //     '(',
  //     ' ',
  //     underber,
  //     ' ',
  //     ')',
  //     ' '
  //   )
  //   setBlazeListIndex((prev) => prev + 1)
  //   setStr(strArray.join(''))
  // }

  return (
    <div className='mx-auto max-w-xl'>
      {/* <button onClick={() => createBlazeList()}>btn</button>
      <div className='text-lg'>{str}</div> */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        title='括弧抜きを作成'
      >
        <div className='flex justify-between'>
          <Button color='red' onClick={() => setOpened(false)}>
            Cansel
          </Button>
          <Button>OK</Button>
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
