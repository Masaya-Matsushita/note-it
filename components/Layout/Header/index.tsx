import { ErrorModal } from 'components/Modal/ErrorModal'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc } from 'firebase/firestore'
import db from 'firebaseConfig/firebase'
import { useHeaderState } from 'hooks/StateManagement/useHeaderState'
import { HeaderLogo } from './HeaderLogo'
import { HeaderIcon } from './HeaderIcon'

export const Header = () => {
  const router = useRouter()
  const uid = router.query.uid
  const { state, dispatch } = useHeaderState()

  const checkIsLogin = async () => {
    if (typeof uid === 'string') {
      // ユーザーアイコンを表示
      const docSnap = await getDoc(doc(db, 'users', uid))
      if (docSnap.exists()) {
        dispatch({
          type: 'display',
          userIcon: docSnap.data().iconURL,
          userName: docSnap.data().userName,
        })
      }
    } else {
      dispatch({ type: 'icon', userIcon: '' })
    }
  }

  useEffect(() => {
    checkIsLogin()
  }, [uid])

  return (
    <div>
      <ErrorModal error={state.error} dispatch={dispatch} />
      <div className='flex justify-between items-center mb-4 h-20 bg-dark-700 sm:h-24'>
        <HeaderLogo uid={uid} />
        <HeaderIcon state={state} dispatch={dispatch} />
      </div>
    </div>
  )
}
