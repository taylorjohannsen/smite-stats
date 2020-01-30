import { createStore } from 'redux'
import updateState from './reducers/updateState'

let store = createStore(updateState)

export default store