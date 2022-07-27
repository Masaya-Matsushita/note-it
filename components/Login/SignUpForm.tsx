import { TextInput, PasswordInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { ErrorModal } from 'components/Modal/ErrorModal'
import { LoginButton } from 'components/Parts/LoginButton'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { useRouter } from 'next/router'
import { FC, useCallback } from 'react'
import { AiOutlineMail, AiOutlineKey } from 'react-icons/ai'
import { RiBallPenLine } from 'react-icons/ri'
import { Reducer, useReducer } from 'react'
import { z } from 'zod'
import { useForm, zodResolver } from '@mantine/form'

type Props = { label: '新規登録' }

type State = typeof initialState

type Action = {
  type: 'loading' | 'error' | 'resetError'
} & Partial<State>

type SignUpValues = {
  name: string
  email: string
  password: string
}

const initialState = {
  loading: false,
  error: '',
  method: '',
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
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
  }
}

// フォームのバリデーション
const signUpShema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: '2~10文字で入力してください。' })
    .max(10, { message: '2~10文字で入力してください。' }),
  email: z
    .string()
    .trim()
    .email({ message: 'メールアドレスが正しくありません。' }),
  password: z
    .string()
    .trim()
    .regex(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{6,100}$/i, {
      message: '「半角英数をそれぞれ含む6文字以上」で入力してください。',
    }),
})

export const SignUpForm: FC<Props> = ({ label }) => {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)
  // フォームの初期値
  const signUpForm = useForm({
    schema: zodResolver(signUpShema),
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  // email & passwordで新規登録
  const emailSignUp = useCallback(
    async (values: SignUpValues) => {
      try {
        dispatch({ type: 'loading', loading: true })
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        )
        const user = auth.currentUser
        if (user) {
          // displayNameにnameを設定
          await updateProfile(user, { displayName: values.name })
          auth.languageCode = 'ja'
          // 確認メールを送信
          await sendEmailVerification(user)
          showNotification({
            title: '認証メールを送信しました！',
            message: 'メールフォルダをご確認ください',
            autoClose: 10000,
            icon: <AiOutlineMail size={20} />,
            style: { padding: '15px' },
          })
          // my-pageへ遷移
          router.push(`/my-page/${user.uid}`)
        }
        dispatch({ type: 'loading', loading: false })
      } catch (error: any) {
        dispatch({ type: 'error', error: error.code, method: 'signup' })
      }
    },
    [router]
  )

  return (
    <div>
      <ErrorModal
        error={state.error}
        method={state.method}
        dispatch={dispatch}
      />
      <form
        onSubmit={signUpForm.onSubmit((values) => emailSignUp(values))}
        className='mx-auto max-w-[480px]'
      >
        <TextInput
          required
          id='username'
          label='User Name'
          placeholder='User Name'
          size='md'
          icon={<RiBallPenLine />}
          {...signUpForm.getInputProps('name')}
        />
        <TextInput
          required
          id='email'
          label='Email'
          placeholder='example@mail.com'
          mt='sm'
          size='md'
          icon={<AiOutlineMail />}
          {...signUpForm.getInputProps('email')}
        />
        <PasswordInput
          required
          id='password'
          label='Password'
          placeholder='半角英数6文字以上'
          mt='sm'
          size='md'
          icon={<AiOutlineKey />}
          {...signUpForm.getInputProps('password')}
        />
        <LoginButton label={label} loading={state.loading} />
      </form>
    </div>
  )
}
