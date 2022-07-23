import { Reducer, useReducer } from 'react'

const initialState = {
  error: '',
  method: '',
  pageLoading: true,
}

type State = Partial<typeof initialState>

type Action = {
  type: 'error'
} & State

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'error': {
      return {
        ...state,
        error: action.error,
        method: action.method,
        pageLoading: false,
      }
    }
  }
}

export const useAuthRedirectState = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}
