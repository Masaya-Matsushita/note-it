import { AuthProvider } from 'components/Login/AuthProvider'
import { ErrorModal } from 'components/Modal/ErrorModal'
import { useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { LoginForm } from 'components/Login/LoginForm'
import { useLoginState } from 'hooks/useLoginState'

const Login: NextPage = () => {
  const router = useRouter()
  const { state, dispatch } = useLoginState()

  // localStorageにemailが保存されていた場合
  useEffect(() => {
    if (localStorage.hasOwnProperty('email')) {
      dispatch({
        type: 'setEmail',
        emailValue: localStorage.email,
      })
    }
  }, [])

  return (
    <>
      <ErrorModal
        error={state.error}
        method={state.method}
        dispatch={dispatch}
      />
      <LoginForm state={state} dispatch={dispatch} router={router} />
      <AuthProvider router={router} />
    </>
  )
}

export default Login
