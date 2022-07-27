import { ErrorModal } from 'components/Modal/ErrorModal'
import { useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { getRedirectResult, signInWithRedirect } from 'firebase/auth'
import {
  auth,
  githubProvider,
  googleProvider,
  twitterProvider,
} from 'firebaseConfig/firebase'
import { LoadingOverlay } from '@mantine/core'
import { Reducer, useReducer } from 'react'

type State = typeof initialState

type Action = {
  type: 'error'
} & Partial<State>

const initialState = {
  error: '',
  method: '',
  pageLoading: true,
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'error': {
      return {
        ...state,
        error: action.error ?? '',
        method: action.method ?? '',
        pageLoading: false,
      }
    }
  }
}

const AuthRedirectWithGoogle: NextPage = () => {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    // 各プロバイダへリダイレクト認証
    getRedirectResult(auth)
      .then((result) => {
        // ユーザーが未認証の時のみリダイレクト
        if (result === null) {
          // queryの値で認証先プロバイダを判断
          if (router.query.provider === 'google') {
            signInWithRedirect(auth, googleProvider)
          } else if (router.query.provider === 'twitter') {
            signInWithRedirect(auth, twitterProvider)
          } else if (router.query.provider === 'github') {
            signInWithRedirect(auth, githubProvider)
          }
        }
      })
      .catch((error: any) => {
        dispatch({ type: 'error', error: error.code, method: 'redirect' })
      })
  }, [router.isReady])

  return (
    <>
      <ErrorModal
        router={router}
        error={state.error}
        method={state.method}
        dispatch={dispatch}
      />
      <LoadingOverlay
        visible={state.pageLoading}
        loaderProps={{ size: 'xl' }}
      />
    </>
  )
}

export default AuthRedirectWithGoogle
