import { ErrorModal } from 'components/Modal/ErrorModal'
import { UserProfileModal } from 'components/Modal/UserProfileModal'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { Menu } from '@mantine/core'
import { AiOutlineDown } from 'react-icons/ai'
import { Logout, Settings } from 'tabler-icons-react'
import Link from 'next/link'

export const Header = () => {
  const router = useRouter()
  const [uid, setUid] = useState('')
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
          setUid(user.uid)
          setUserIcon(docSnap.data().iconURL)
        }
      } else {
        setUid('')
        setUserIcon('')
      }
    })
  }

  useEffect(() => {
    checkIsLogin()
  }, [])

  return (
    <div className='flex justify-between items-center mb-4 h-20 bg-dark-700 sm:h-24'>
      <ErrorModal error={error} setError={setError} />
      <Link href={uid ? `/my-page/${uid}` : '/'}>
        <a className='ml-6 text-2xl text-dark-100 no-underline hover:cursor-pointer sm:ml-12 sm:text-3xl'>
          Note It
        </a>
      </Link>
      {userIcon ? (
        <div>
          <UserProfileModal opened={opened} setOpened={setOpened} />
          <Menu
            control={
              <div className='flex items-center hover:cursor-pointer'>
                <img
                  src={userIcon}
                  alt='userIcon'
                  className='mr-2 w-10 h-10 rounded-full sm:mr-6 sm:w-12 sm:h-12'
                />
                <AiOutlineDown />
              </div>
            }
            className='mt-2 mr-6 sm:mr-12 lg:mr-20'
            classNames={{
              body: 'md:w-60',
              label: 'md:h-10 md:text-base',
              item: 'md:h-10 md:text-sm',
            }}
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
