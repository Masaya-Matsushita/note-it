import { ErrorModal } from 'components/Modal/ErrorModal'
import { SendEmailTroubleModal } from 'components/Modal/SendEmailTroubleModal'
import Link from 'next/link'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { showNotification } from '@mantine/notifications'
import { Button, TextInput } from '@mantine/core'
import { AiOutlineMail } from 'react-icons/ai'
import { Reducer, useCallback, useReducer } from 'react'
import { useForm } from '@mantine/form'

type State = typeof initialState

type Action = {
  type: 'loading' | 'error' | 'resetError'
} & Partial<State>

const initialState = {
  loading: false,
  error: '',
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'loading': {
      return {
        ...state,
        loading: action.loading ? action.loading : false,
      }
    }
    case 'error': {
      return {
        ...state,
        error: action.error ? action.error : '',
        loading: false,
      }
    }
    case 'resetError': {
      return {
        ...state,
        error: action.error ? action.error : '',
      }
    }
  }
}

export const EmailForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  // フォームのバリデーション
  const emailForm = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : 'メールアドレスが正しくありません。',
    },
  })

  // 再設定メールを送信
  const handleSubmit = useCallback(
    async (value: { email: string }) => {
      try {
        dispatch({ type: 'loading', loading: true })
        auth.languageCode = 'ja'
        await sendPasswordResetEmail(auth, value.email)
        emailForm.reset()
        showNotification({
          message: '再設定メールが送信されました。',
          autoClose: 10000,
          icon: <AiOutlineMail size={20} />,
          style: { padding: '15px' },
        })
      } catch (error: any) {
        dispatch({ type: 'error', error: error.code })
      }
      dispatch({ type: 'loading', loading: false })
    },
    [emailForm]
  )

  return (
    <div>
      <ErrorModal error={state.error} dispatch={dispatch} />
      <form
        className='px-4 mx-auto mt-12 max-w-lg'
        onSubmit={emailForm.onSubmit((value) => handleSubmit(value))}
      >
        <TextInput
          required
          label='Your Email'
          placeholder='example@mail.com'
          size='md'
          icon={<AiOutlineMail />}
          {...emailForm.getInputProps('email')}
        />
        <div className='flex flex-col-reverse mt-8 xs:flex-row xs:justify-between'>
          <Link href='/login' passHref>
            <a className='mt-5 ml-2 w-full text-center text-dark-100 no-underline xs:mt-2 xs:w-auto sm:text-base'>
              ← ログインページに戻る
            </a>
          </Link>
          <Button
            type='submit'
            loading={state.loading}
            className='xs:w-48 xs:h-12'
          >
            送信
          </Button>
        </div>
        <SendEmailTroubleModal resendButton={false} />
      </form>
    </div>
  )
}
