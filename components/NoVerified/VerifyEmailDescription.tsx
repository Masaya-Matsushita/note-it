import { ErrorModal } from 'components/Parts/ErrorModal'
import { Button, Stepper } from '@mantine/core'
import { Reducer, useCallback, useReducer } from 'react'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'

type State = typeof initialState

type Action = {
  type: 'error' | 'active' | 'resetError'
} & Partial<State>

const initialState = {
  error: '',
  method: '',
  active: 0,
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'error': {
      return {
        ...state,
        error: action.error ?? '',
        method: action.method ?? '',
      }
    }
    case 'resetError': {
      return {
        ...state,
        error: action.error ?? '',
        method: action.method ?? '',
      }
    }
    case 'active': {
      return {
        ...state,
        active: action.active ?? 0,
      }
    }
  }
}

const ITEMS = [
  '登録したアドレス宛に「認証メール」が届いていることを確認。',
  'メール本文内のリンクをクリックすることで認証が完了します。',
  '「マイページへ」ボタンからマイページへ移動してください。',
]

export const VerifyEmailDescription = () => {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)

  const toMyPage = useCallback(() => {
    onAuthStateChanged(auth, (user) => {
      try {
        // 認証済でmy-pageへ遷移
        if (user?.emailVerified === true) {
          router.push(`my-page/${user.uid}`)
        } else {
          throw new Error('auth/user-not-verified')
        }
      } catch (error: any) {
        dispatch({ type: 'error', error: error.message, method: 'updateUser' })
      }
    })
  }, [router])

  return (
    <div>
      <ErrorModal
        error={state.error}
        method={state.method}
        dispatch={dispatch}
      />
      <div className='mx-auto max-w-[620px]'>
        <Stepper
          active={state.active}
          onStepClick={(e) => dispatch({ type: 'active', active: e })}
          orientation='vertical'
          iconSize={48}
          className='p-2 mb-8'
          classNames={{
            stepIcon: 'sm:w-14 sm:h-14',
            stepLabel: 'sm:text-lg',
          }}
        >
          {ITEMS.map((item) => {
            return <Stepper.Step key={item} label={item} />
          })}
        </Stepper>
      </div>
      <div className='mx-4'>
        <Button
          className='block mb-8 ml-auto w-full xs:w-48 xs:h-12 xs:text-lg'
          onClick={toMyPage}
        >
          マイページへ
        </Button>
      </div>
    </div>
  )
}
