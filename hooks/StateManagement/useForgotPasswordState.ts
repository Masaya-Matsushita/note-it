import { Reducer, useReducer } from 'react'

const initialState = {
  error: '',
  loading: false,
}

type State = typeof initialState

type Action = {
  type: 'error' | 'loading' | 'end'
} & Partial<State>

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
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
        error: action.error ? action.error : '',
        loading: false,
      }
    }
  }
}

export const useForgotPasswordState = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}
