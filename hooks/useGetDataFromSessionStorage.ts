import { useEffect, useState } from 'react'

export const useGetDataFromSessionStorage = () => {
  const [currentBook, setCurrentBook] = useState({
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
  // マウント時、book,noteを取得
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
