import {applyMiddleware, combineReducers, createStore} from 'redux';
import {composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk';
import userReducer from './userReducer';
import appReducer from './appReducer';
import taskReducer from './taskReducer';


const rootReducer = combineReducers({
    user: userReducer,
    app: appReducer,
    task: taskReducer
})

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
