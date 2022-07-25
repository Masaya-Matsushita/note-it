import { Reducer, useReducer } from 'react'

type State = typeof initialState

type Action = {
  type:
    | 'opened'
    | 'label'
    | 'page'
    | 'error'
    | 'cloze'
    | 'note'
    | 'showClozeNote'
    | 'clozeNote'
    | 'cancelClozeModal'
    | 'okClozeModal'
    | 'toggleClozeSwitch'
    | 'setBookAndNote'
    | 'setBook'
} & Partial<State>

const initialState = {
  edit: false,
  opened: false,
  title: '',
  label: '',
  page: 0,
  note: '',
  error: '',
  cloze: false,
  showClozeNote: false,
  clozeNote: '',
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'opened':
      return {
        ...state,
        opened: action.opened ? action.opened : false,
      }
    case 'label':
      return {
        ...state,
        label: action.label ? action.label : '',
      }
    case 'page':
      return {
        ...state,
        page: action.page ? action.page : 0,
      }
    case 'note':
      return {
        ...state,
        note: action.note ? action.note : '',
      }
    case 'error':
      return {
        ...state,
        error: action.error ? action.error : '',
      }
    case 'cloze':
      return {
        ...state,
        cloze: action.cloze ? action.cloze : false,
      }
    case 'showClozeNote':
      return {
        ...state,
        showClozeNote: action.showClozeNote ? action.showClozeNote : false,
      }
    case 'clozeNote':
      return {
        ...state,
        clozeNote: action.clozeNote ? action.clozeNote : '',
      }
    case 'cancelClozeModal':
      return {
        ...state,
        cloze: action.cloze ? action.cloze : false,
        opened: action.opened ? action.opened : false,
      }
    case 'okClozeModal':
      return {
        ...state,
        showClozeNote: action.showClozeNote ? action.showClozeNote : false,
        opened: action.opened ? action.opened : false,
      }
    case 'toggleClozeSwitch':
      return {
        ...state,
        cloze: action.cloze ? action.cloze : false,
        opened: action.opened ? action.opened : false,
        showClozeNote: action.showClozeNote ? action.showClozeNote : false,
      }
    case 'setBook':
      return {
        ...state,
        title: action.title ? action.title : '',
      }
    case 'setBookAndNote':
      return {
        ...state,
        edit: action.edit ? action.edit : false,
        title: action.title ? action.title : '',
        label: action.label ? action.label : '',
        page: action.page ? action.page : 0,
        note: action.note ? action.note : '',
      }
  }
}

export const useNoteFormState = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return { state, dispatch }
}
