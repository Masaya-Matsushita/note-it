import { Checkbox, TextInput, PasswordInput } from '@mantine/core'
import { ErrorModal } from 'components/Modal/ErrorModal'
import { LoginButton } from 'components/Parts/LoginButton'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { useSignInState } from 'hooks/StateManagement/Login/useSignInState'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ComponentProps, FC, useEffect } from 'react'
import { AiOutlineMail, AiOutlineKey } from 'react-icons/ai'

type Props = { label: 'ログイン' }

export const SignInForm: FC<Props> = ({ label }) => {
  const router = useRouter()
  const { state, dispatch } = useSignInState()

  // localStorageにemailが保存されていた場合
  useEffect(() => {
    if (localStorage.hasOwnProperty('email')) {
      dispatch({
        type: 'setEmail',
        emailValue: localStorage.email,
      })
    }
  }, [])

  // email & passwordでログイン
  const emailSignIn: ComponentProps<'form'>['onSubmit'] = async (e) => {
    try {
      e.preventDefault()
      dispatch({ type: 'loading', loading: true })
      const email = String(e.currentTarget.email.value)
      const password = String(e.currentTarget.password.value)
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
  }

  return (
    <div>
      <ErrorModal
        error={state.error}
        method={state.method}
        dispatch={dispatch}
      />
      <form onSubmit={emailSignIn} className='mx-auto max-w-[480px]'>
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
          mt='sm'
          size='md'
          icon={<AiOutlineKey />}
        />
        <div className='flex flex-col items-end mt-6 text-dark-200 xs:flex-row xs:justify-between xs:items-center'>
          <label htmlFor='checkbox' className='flex items-center'>
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
            <a className='text-dark-200'>パスワードをお忘れですか？</a>
          </Link>
        </div>
        <LoginButton label={label} loading={state.loading} />
      </form>
    </div>
  )
}
