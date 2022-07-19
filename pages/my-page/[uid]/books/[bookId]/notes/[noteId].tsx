import { NextPage } from 'next'
import { useRouter } from 'next/router'

const Note: NextPage = () => {
  const router = useRouter()

  return (
    <>
      <div>{router.query.noteId}</div>
    </>
  )
}

export default Note
