import { Reducer, useReducer } from 'react'

const initialState = {
  error: '',
  userIcon: '',
  userName: '',
}

type State = typeof initialState

type Action = {
  type: 'icon' | 'name' | 'error' | 'display'
} & Partial<State>

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'icon': {
      return {
        ...state,
        userIcon: action.userIcon ? action.userIcon : '',
      }
    }
    case 'name': {
      return {
        ...state,
        userName: action.userName ? action.userName : '',
      }
    }
    case 'display': {
      return {
        ...state,
        userIcon: action.userIcon ? action.userIcon : '',
        userName: action.userName ? action.userName : '',
      }
    }
    case 'error': {
      return {
        ...state,
        error: action.error ? action.error : '',
      }
    }
  }
}

export const useUserProfileModalState = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}
