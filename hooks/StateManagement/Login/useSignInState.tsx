import { Reducer, useReducer } from 'react'

// 状態の初期値
const initialState = {
  loading: false,
  error: '',
  method: '',
  checked: false,
  emailValue: '',
}

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

// reducer関数
const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'setEmail': {
      return {
        ...state,
        emailValue: action.emailValue ? action.emailValue : '',
        checked: true,
      }
    }
    case 'inputEmail': {
      return {
        ...state,
        emailValue: action.emailValue ? action.emailValue : '',
      }
    }
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
    case 'checked': {
      return {
        ...state,
        checked: action.checked ? action.checked : false,
      }
    }
  }
}

export const useSignInState = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return { state, dispatch }
}
