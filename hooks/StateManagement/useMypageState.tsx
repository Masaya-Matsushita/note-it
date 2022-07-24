import { Reducer, useReducer } from 'react'
import { BadgeAndBooksList } from 'types'

const initialState = {
  pageLoading: true,
  opened: false,
  badgeAndBooksList: undefined,
}

type State = {
  pageLoading?: boolean | undefined
  opened?: boolean | undefined
  badgeAndBooksList?: BadgeAndBooksList | undefined
}

type Action = {
  type: 'opened' | 'pageLoading' | 'setList'
} & State

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'opened': {
      return {
        ...state,
        opened: action.opened,
      }
    }
    case 'pageLoading': {
      return {
        ...state,
        pageLoading: false,
      }
    }
    case 'setList': {
      return {
        ...state,
        badgeAndBooksList: action.badgeAndBooksList,
      }
    }
  }
}

export const useMypageState = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}
