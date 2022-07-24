import { Reducer, useReducer } from 'react'

const initialState = {
  error: '',
  userIcon: '',
  userName: '',
}

type State = Partial<typeof initialState>

type Action = {
  type: 'icon' | 'name' | 'error' | 'display'
} & State

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'icon': {
      return {
        ...state,
        userIcon: action.userIcon,
      }
    }
    case 'name': {
      return {
        ...state,
        userName: action.userName,
      }
    }
    case 'display': {
      return {
        ...state,
        userIcon: action.userIcon,
        userName: action.userName,
      }
    }
    case 'error': {
      return {
        ...state,
        error: action.error,
      }
    }
  }
}

export const useUserProfileModalState = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}
