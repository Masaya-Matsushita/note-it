import { Menu } from '@mantine/core'
import { UserProfileModal } from 'components/Modal/UserProfileModal'
import { signOut } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { useRouter } from 'next/router'
import { Dispatch, FC } from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { Settings, Logout } from 'tabler-icons-react'

type Props = {
  state: Partial<{
    userIcon: string
    userName: string
    error: string
    opened: boolean
  }>
  dispatch: Dispatch<
    {
      type: 'error' | 'opened' | 'icon' | 'display' | 'name'
    } & Partial<{
      userIcon: string
      userName: string
      error: string
      opened: boolean
    }>
  >
}

export const HeaderIcon: FC<Props> = ({ state, dispatch }) => {
  const router = useRouter()

  // ログアウト処理
  const logout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error: any) {
      dispatch({ type: 'error', error: error.code })
    }
  }

  if (!state.userIcon) {
    return <div></div>
  }

  return (
    <div>
      <UserProfileModal opened={state.opened} propsDispatch={dispatch} />
      <Menu
        control={
          <div className='flex items-center hover:cursor-pointer'>
            <img
              src={state.userIcon}
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
        <Menu.Label>{state.userName}</Menu.Label>
        <Menu.Item
          icon={<Settings size={14} />}
          onClick={() => dispatch({ type: 'opened', opened: true })}
        >
          Settings
        </Menu.Item>
        <Menu.Item color='red' icon={<Logout size={14} />} onClick={logout}>
          Logout
        </Menu.Item>
      </Menu>
    </div>
  )
}
