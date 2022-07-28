import { useRouter } from 'next/router'
import { useCallback } from 'react'

export const useSetItemAndRouter = () => {
  const router = useRouter()

  const setNoteAndTransition = useCallback(
    (item: string, href: string, query?: string) => {
      sessionStorage.setItem('currentNote', item)
      router.push(query ? { pathname: href, query: query } : href)
    },
    [router]
  )

  const setBookAndTransition = useCallback(
    (item: string, href: string, query?: string) => {
      sessionStorage.setItem('currentBook', item)
      router.push(query ? { pathname: href, query: query } : href)
    },
    [router]
  )

  return { setNoteAndTransition, setBookAndTransition }
}
