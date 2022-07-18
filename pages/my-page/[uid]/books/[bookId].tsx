import { NextPage } from 'next'
import { useRouter } from 'next/router'

const Books: NextPage = () => {
  const router = useRouter()

  return <div>{router.query.bookId}</div>
}

export default Books
