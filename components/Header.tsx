import { Menu } from '@mantine/core'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { Logout, Settings } from 'tabler-icons-react'
import { ErrorModal } from './ErrorModal'
import { UserProfileModal } from './UserProfileModal'

export const Header = () => {
  const router = useRouter()
  const [userIcon, setUserIcon] = useState('')
  const [error, setError] = useState('')
  const [opened, setOpened] = useState(false)

  // ログアウト処理
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error: any) {
      setError(error.code)
    }
  }

  const checkIsLogin = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ユーザーアイコンを表示
        const docSnap = await getDoc(doc(db, 'users', user.uid))
        if (docSnap.exists()) {
          setUserIcon(docSnap.data().iconURL)
        }
      } else {
        setUserIcon('')
      }
    })
  }

  useEffect(() => {
    checkIsLogin()
  }, [])

  return (
    <div className='flex justify-between items-center mb-4 h-16 bg-dark-700 sm:h-20'>
      <ErrorModal error={error} setError={setError} />
      <div className='ml-6 text-2xl sm:ml-12'>Note It</div>
      {userIcon ? (
        <div>
          <UserProfileModal opened={opened} setOpened={setOpened} />
          <Menu
            control={
              <div className='flex items-center'>
                <img
                  src={userIcon}
                  alt='userIcon'
                  className='mr-1 w-10 h-10 rounded-full sm:mr-2 sm:w-12 sm:h-12'
                />
                <AiOutlineDown />
              </div>
            }
            className='mt-2 mr-6 sm:mr-12'
          >
            <Menu.Label>Menu</Menu.Label>
            <Menu.Item
              icon={<Settings size={14} />}
              onClick={() => setOpened(true)}
            >
              Settings
            </Menu.Item>
            <Menu.Item color='red' icon={<Logout size={14} />} onClick={logout}>
              Logout
            </Menu.Item>
          </Menu>
        </div>
      ) : null}
    </div>
  )
}
