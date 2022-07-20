import { NextPage } from 'next'
import { useRouter } from 'next/router'

const NoteForm: NextPage = () => {
  const router = useRouter()

  console.log(router.query);
  
  return (
    <>
      <div>hello</div>
    </>
  )
}

export default NoteForm
