import { useRouter } from 'next/router'
import { useCallback } from 'react'

export const useSetItemAndRouter = () => {
  const router = useRouter()

  const setNoteAndTransition = useCallback(
    (item: string, href: string, noteId?: string) => {
      sessionStorage.setItem('currentNote', item)
      router.push(noteId ? { pathname: href, query: { id: noteId } } : href)
    },
    [router]
  )

  const setBookAndTransition = useCallback(
    (item: string, href: string, bookId?: string) => {
      sessionStorage.setItem('currentBook', item)
      router.push(bookId ? { pathname: href, query: { id: bookId } } : href)
    },
    [router]
  )

  return { setNoteAndTransition, setBookAndTransition }
}
