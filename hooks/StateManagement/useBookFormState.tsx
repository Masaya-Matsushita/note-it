import { Reducer, useReducer } from 'react'

const initialState = {
  title: '',
  badge: '1,学校',
  overview: '',
  initBadge: '',
  error: false,
}

type State = Partial<typeof initialState>

type Action = {
  type: 'set' | 'title' | 'badge' | 'overview' | 'error'
} & State

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'set': {
      return {
        ...state,
        title: action.title,
        badge: action.badge,
        initBadge: action.badge,
        overview: action.overview,
      }
    }
    case 'title': {
      return {
        ...state,
        title: action.title,
      }
    }
    case 'badge': {
      return {
        ...state,
        badge: action.badge,
      }
    }
    case 'overview': {
      return {
        ...state,
        overview: action.overview,
      }
    }
    case 'error': {
      return {
        ...state,
        error: true,
      }
    }
  }
}

export const useBookFormState = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return { state, dispatch }
}
