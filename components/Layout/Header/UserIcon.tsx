import { Menu } from '@mantine/core'
import { ErrorModal } from 'components/Modal/ErrorModal'
import { UserProfileModal } from 'components/Modal/UserProfileModal'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import db, { auth } from 'firebaseConfig/firebase'
import { useRouter } from 'next/router'
import { Reducer, useCallback, useEffect, useReducer } from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { Settings, Logout } from 'tabler-icons-react'

type State = typeof initialState

type Action = {
  type: 'icon' | 'name' | 'error' | 'display' | 'opened' | 'resetError'
} & Partial<State>

const initialState = {
  userIcon: '',
  userName: '',
  error: '',
  opened: false,
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'icon': {
      return {
        ...state,
        userIcon: action.userIcon ? action.userIcon : '',
      }
    }
    case 'name': {
      return {
        ...state,
        userName: action.userName ? action.userName : '',
      }
    }
    case 'display': {
      return {
        ...state,
        userIcon: action.userIcon ? action.userIcon : '',
        userName: action.userName ? action.userName : '',
      }
    }
    case 'error': {
      return {
        ...state,
        error: action.error ? action.error : '',
      }
    }
    case 'resetError': {
      return {
        ...state,
        error: action.error ?? '',
      }
    }
    case 'opened': {
      return {
        ...state,
        opened: action.opened ? action.opened : false,
      }
    }
  }
}

export const UserIcon = () => {
  const router = useRouter()
  const uid = router.query.uid
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    // ユーザがログインしているときはアイコンを表示させる
    ;(async () => {
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
    })()
  }, [uid])

  // ログアウト処理
  const logout = useCallback(async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error: any) {
      dispatch({ type: 'error', error: error.code })
    }
  }, [router])

  return (
    <div>
      {state.userIcon ? (
        <div>
          <ErrorModal error={state.error} dispatch={dispatch} />
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
      ) : null}
    </div>
  )
}
