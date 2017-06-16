import * as redux from 'redux'

import { api } from '../api'
import { Store } from '../reducers/index'

type Q<T> = { request: T }
type S<T> = { response: T }
type E = { error: Error }

type QEmpty = Q<null>
type QValue = Q<{}>

export type Action =
// API Requests
| ({ type: 'SAVE_DATA_REQUEST' } & QValue)
| ({ type: 'SAVE_DATA_SUCCESS' } & QValue & S<{}>)
| ({ type: 'SAVE_DATA_ERROR'   } & QValue & E)

| ({ type: 'LOAD_DATA_REQUEST' } & QEmpty)
| ({ type: 'LOAD_DATA_SUCCESS' } & QEmpty & S<{ message: Object }>)
| ({ type: 'LOAD_DATA_ERROR'   } & QEmpty & E)

export type ApiActionGroup<_Q, _S> = {
  request: (q?: _Q)         => Action & Q<_Q>
  success: (s: _S, q?: _Q)  => Action & Q<_Q> & S<_S>
  error: (e: Error, q?: _Q) => Action & Q<_Q> & E
}

const _saveData: ApiActionGroup<{ message: Object }, {}> = {
  request: (request) =>
    ({ type: 'SAVE_DATA_REQUEST', request }),
  success: (response, request) =>
    ({ type: 'SAVE_DATA_SUCCESS', request, response }),
  error: (error, request) =>
    ({ type: 'SAVE_DATA_ERROR',   request, error }),
}

const _loadData: ApiActionGroup<null, { message: Object }> = {
  request: (request) =>
    ({ type: 'LOAD_DATA_REQUEST', request: null }),
  success: (response, request) =>
   { return ({ type: 'LOAD_DATA_SUCCESS', request: null, response }) },
  error: (error, request) =>
    ({ type: 'LOAD_DATA_ERROR',   request: null, error }),
}

type apiFunc<Q, S> = (q: Q) => Promise<S>

function apiActionGroupFactory<Q, S>(x: ApiActionGroup<Q, S>, go: apiFunc<Q, S>) {
  return (request: Q) => (dispatch: redux.Dispatch<Store.All>) => {
    dispatch(x.request(request))
    go(request)
      .then((response) => dispatch(x.success(response, request)))
      .catch((e: Error) => dispatch(x.error(e, request)))
  }
}

export const saveData = apiActionGroupFactory(_saveData, api.save)
export const loadData = () => apiActionGroupFactory(_loadData, api.load)(null)

