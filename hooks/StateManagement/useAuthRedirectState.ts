import { Reducer, useReducer } from 'react'

const initialState = {
  error: '',
  method: '',
  pageLoading: true,
}

type State = typeof initialState

type Action = {
  type: 'error'
} & Partial<State>

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'error': {
      return {
        ...state,
        error: action.error ? action.error : '',
        method: action.method ? action.method : '',
        pageLoading: false,
      }
    }
  }
}

export const useAuthRedirectState = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}
