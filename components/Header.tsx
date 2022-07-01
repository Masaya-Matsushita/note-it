import { Menu, Skeleton } from '@mantine/core'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { useEffect, useState } from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { Logout, Settings } from 'tabler-icons-react'
import { UserProfileModal } from './UserProfileModal'

export const Header = () => {
  const [userIcon, setUserIcon] = useState('')
  const [opened, setOpened] = useState(false)

  const getUserIcon = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
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
    getUserIcon()
  }, [])

  return (
    <div className='flex justify-between p-4 bg-dark-700'>
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
            <Menu.Item color='red' icon={<Logout size={14} />}>
              Logout
            </Menu.Item>
          </Menu>
        </div>
      ) : (
        <div className='flex items-center'>
          <Skeleton className='w-10 h-10 rounded-full sm:w-12 sm:h-12' />
          <AiOutlineDown />
        </div>
      )}
    </div>
  )
}
