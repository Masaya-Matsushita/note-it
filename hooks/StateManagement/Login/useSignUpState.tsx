import { Reducer, useReducer } from 'react'

// 状態の初期値
const initialState = {
  loading: false,
  error: '',
  method: '',
}

type State = typeof initialState

type Action = {
  type: 'loading' | 'error' | 'resetError'
} & Partial<State>

// reducer関数
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
        method: action.method ? action.method : '',
        loading: false,
      }
    }
    case 'resetError': {
      return {
        ...state,
        error: action.error ? action.error : '',
        method: action.method ? action.method : '',
      }
    }
  }
}

export const useSignUpState = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return { state, dispatch }
}
