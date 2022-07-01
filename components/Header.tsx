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
    <div className='flex justify-between items-center pt-4 pb-2 bg-dark-700'>
      <ErrorModal error={error} setError={setError} />
      <div className='text-2xl'>Note It</div>
      {userIcon ? (
        <div>
          <UserProfileModal opened={opened} setOpened={setOpened} />
          <Menu
            control={
              <div className='flex items-center'>
                <img
                  src={userIcon}
                  alt='userIcon'
                  className='mr-1 w-10 h-10 rounded-full sm:w-12 sm:h-12'
                />
                <AiOutlineDown />
              </div>
            }
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
