import { Reducer, useReducer } from 'react'

const initialState = {
  userIcon: '',
  userName: '',
  error: '',
  opened: false,
}

type State = Partial<typeof initialState>

type Action = {
  type: 'icon' | 'name' | 'error' | 'display' | 'opened'
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
    case 'opened': {
      return {
        ...state,
        opened: action.opened,
      }
    }
  }
}

export const useHeaderState = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}
