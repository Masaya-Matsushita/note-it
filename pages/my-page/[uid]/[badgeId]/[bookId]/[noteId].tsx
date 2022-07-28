import { Button } from '@mantine/core'
import { NoteDisplay } from 'components/Note/NoteDisplay'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Note: NextPage = () => {
  const router = useRouter()
  const uid = String(router.query.uid)
  const badgeId = String(router.query.badgeId)
  const bookId = String(router.query.bookId)
  const [noteData, setNoteData] = useState({
    id: '',
    label: '',
    page: 0,
    note: '',
    clozeNote: '',
  })

  // マウント時、noteを取得
  useEffect(() => {
    const jsonTargetNote = sessionStorage.getItem('targetNote')
    if (jsonTargetNote) {
      const targetNote = JSON.parse(jsonTargetNote)
      setNoteData(targetNote)
    }
  }, [])

  return (
    <>
      <div className='mx-auto max-w-xl'>
        <div className='mt-4 ml-2 text-3xl font-bold'>{noteData.label}</div>
        <div className='flex justify-end items-center mr-4 mb-4 xs:mr-8'>
          <div className='text-xl'>Page :</div>
          <div className='inline-block py-1 px-2 ml-2 text-xl font-semibold bg-dark-600 rounded-md'>
            {noteData.page}
          </div>
        </div>
        <NoteDisplay noteData={noteData} />
        <div className='mx-2 xs:mx-6'>
          <Link href={`/my-page/${uid}/${badgeId}/${bookId}`} passHref>
            <Button className='w-full'>戻る</Button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Note
