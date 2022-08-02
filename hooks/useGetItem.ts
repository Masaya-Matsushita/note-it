import { useEffect, useState } from 'react'
import { Book } from 'types'

export const useGetItem = () => {
  const [currentBook, setCurrentBook] = useState<Book>({
    title: '',
    badge: '',
    overview: '',
  })
  const [currentNote, setCurrentNote] = useState({
    id: '',
    label: '',
    page: 0,
    note: '',
    clozeNote: '',
  })
  // マウント時、sessionStorageからbook,noteを取得
  useEffect(() => {
    const jsonCurrentBook = sessionStorage.getItem('currentBook')
    const jsonCurrentNote = sessionStorage.getItem('currentNote')
    if (jsonCurrentBook) {
      const currentBook = JSON.parse(jsonCurrentBook)
      setCurrentBook(currentBook)
    }
    if (jsonCurrentNote) {
      const currentNote = JSON.parse(jsonCurrentNote)
      setCurrentNote(currentNote)
    }
  }, [])
  return { currentBook, currentNote }
}
