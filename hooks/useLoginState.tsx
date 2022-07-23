import { Reducer, useReducer } from 'react'

// 状態の初期値
const initialState = {
  loading: false,
  error: '',
  method: '',
  checked: false,
  emailValue: '',
}

type State = Partial<typeof initialState>

type Action = {
  type:
    | 'setEmail'
    | 'inputEmail'
    | 'loading'
    | 'end'
    | 'error'
    | 'resetError'
    | 'checked'
} & State

// reducer関数
const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'setEmail': {
      return {
        ...state,
        emailValue: action.emailValue,
        checked: true,
      }
    }
    case 'inputEmail': {
      return {
        ...state,
        emailValue: action.emailValue,
      }
    }
    case 'loading': {
      return {
        ...state,
        loading: true,
      }
    }
    case 'end': {
      return {
        ...state,
        loading: false,
      }
    }
    case 'error': {
      return {
        ...state,
        error: action.error,
        method: action.method,
        loading: false,
      }
    }
    case 'resetError': {
      return {
        ...state,
        error: '',
        method: '',
      }
    }
    case 'checked': {
      return {
        ...state,
        checked: action.checked,
      }
    }
  }
}

export const useLoginState = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return { state, dispatch }
}
