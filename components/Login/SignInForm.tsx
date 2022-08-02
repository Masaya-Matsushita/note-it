import { Checkbox, TextInput, PasswordInput } from '@mantine/core'
import { ErrorModal } from 'components/Parts/ErrorModal'
import { LoginButton } from 'components/Parts/LoginButton'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, FormEvent, useCallback, useEffect } from 'react'
import { AiOutlineMail, AiOutlineKey } from 'react-icons/ai'
import { Reducer, useReducer } from 'react'

type Props = { label: 'ログイン' }

type State = typeof initialState

type Action = {
  type:
    | 'setEmail'
    | 'inputEmail'
    | 'loading'
    | 'error'
    | 'resetError'
    | 'checked'
} & Partial<State>

const initialState = {
  loading: false,
  error: '',
  method: '',
  checked: false,
  emailValue: '',
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'setEmail': {
      return {
        ...state,
        emailValue: action.emailValue ?? '',
        checked: true,
      }
    }
    case 'inputEmail': {
      return {
        ...state,
        emailValue: action.emailValue ?? '',
      }
    }
    case 'loading': {
      return {
        ...state,
        loading: action.loading ?? false,
      }
    }
    case 'error': {
      return {
        ...state,
        error: action.error ?? '',
        method: action.method ?? '',
        loading: false,
      }
    }
    case 'resetError': {
      return {
        ...state,
        error: action.error ?? '',
        method: action.method ?? '',
      }
    }
    case 'checked': {
      return {
        ...state,
        checked: action.checked ?? false,
      }
    }
  }
}

export const SignInForm: FC<Props> = ({ label }) => {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    // localStorageにemailがある場合、値をセット
    if (localStorage.hasOwnProperty('email')) {
      dispatch({
        type: 'setEmail',
        emailValue: localStorage.email,
      })
    }
  }, [])

  // email & passwordでログイン
  const emailSignIn = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault()
        dispatch({ type: 'loading', loading: true })
        const email = String(e.currentTarget.email.value.trim())
        const password = String(e.currentTarget.password.value.trim())
        await signInWithEmailAndPassword(auth, email, password)
        // localStorageにemailを保存or削除
        if (state.checked) {
          localStorage.setItem('email', email)
        } else {
          localStorage.removeItem('email')
        }
        // my-pageへ遷移
        const user = auth.currentUser
        router.push(`/my-page/${user?.uid}`)
        dispatch({ type: 'loading', loading: false })
      } catch (error: any) {
        dispatch({ type: 'error', error: error.code, method: 'signin' })
      }
    },
    [router, state.checked]
  )

  return (
    <div>
      <ErrorModal
        error={state.error}
        method={state.method}
        dispatch={dispatch}
      />
      <form onSubmit={emailSignIn} className='mx-2 max-w-[480px] xs:mx-auto'>
        <TextInput
          required
          id='email'
          name='email'
          label='Email'
          placeholder='example@mail.com'
          value={state.emailValue}
          onChange={(e) =>
            dispatch({
              type: 'inputEmail',
              emailValue: e.currentTarget.value,
            })
          }
          size='md'
          icon={<AiOutlineMail />}
        />
        <PasswordInput
          required
          id='name'
          name='password'
          label='Password'
          placeholder='半角英数6文字以上'
          mt='md'
          size='md'
          icon={<AiOutlineKey />}
        />
        <div className='flex flex-col items-end mt-6 text-dark-200 xs:flex-row xs:justify-between xs:items-center'>
          <label
            htmlFor='checkbox'
            className='flex items-center hover:cursor-pointer'
          >
            <Checkbox
              id='checkbox'
              checked={state.checked}
              onChange={(e) =>
                dispatch({
                  type: 'checked',
                  checked: e.currentTarget.checked,
                })
              }
              className='inline-block mr-2'
            />
            メールアドレスを記憶する
          </label>
          <Link href={'/forgot-password'} passHref>
            <a className='mt-3 text-dark-200 xs:mt-0'>
              パスワードをお忘れですか？
            </a>
          </Link>
        </div>
        <LoginButton label={label} loading={state.loading} />
      </form>
    </div>
  )
}
