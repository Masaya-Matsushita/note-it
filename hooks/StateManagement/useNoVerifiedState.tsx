import { Reducer, useReducer } from 'react'

const initialState = {
  error: '',
  method: '',
  active: 0,
}

type State =  typeof initialState

type Action = {
  type: 'error' | 'active'
} & Partial<State>

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'error': {
      return {
        ...state,
        error: action.error ? action.error : '',
        method: action.method ? action.method : '',
      }
    }
    case 'active': {
      return {
        ...state,
        active: action.active ? action.active : 0,
      }
    }
  }
}

export const useNoVerifiedState = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}
