import { combineReducers } from 'redux'

import { Action } from '../actions'

export namespace Store {

  export type Data = { message?: Object }

  export type All = {
    data: Data,
    isSaving: boolean,
    isLoading: boolean,
    error: string,
  }
}

function isSaving (state: boolean = false, action: Action): boolean {
  switch (action.type) {
    case 'SAVE_DATA_REQUEST':
      return true
    case 'SAVE_DATA_SUCCESS':
    case 'SAVE_DATA_ERROR':
      return false
    default:
      return state
  }
}

function isLoading (state: boolean = false, action: Action): boolean {
  switch (action.type) {
    case 'LOAD_DATA_REQUEST':
      return true
    case 'LOAD_DATA_SUCCESS':
    case 'LOAD_DATA_ERROR':
      return false
    default:
      return state
  }
}


function error (state: string = '', action: Action): string {
  switch (action.type) {
    case 'LOAD_DATA_REQUEST':
    case 'SAVE_DATA_REQUEST':
      return ''
    case 'LOAD_DATA_ERROR':
    case 'SAVE_DATA_ERROR':
      return action.error.toString()
    default:
      return state
  }
}

const initialState: Store.Data = {
  message: {},
}

function data (state: Store.Data = initialState, action: Action): Store.Data {
  switch (action.type) {
    case 'LOAD_DATA_SUCCESS':
      return { message: Object(action.response.message) }
    default:
      return state
  }
}

export const reducers = combineReducers<Store.All>({
  data,
  isSaving,
  isLoading,
  error,
})
