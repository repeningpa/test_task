const ADD_TASK = "ADD_TASK"
const SET_TASK = "SET_TASK"
const DELETE_TASK = "DELETE_TASK"
const UPDATE_TASK = "UPDATE_TASK"
const INFO_TASK = "INFO_TASK"


const defaultState = {
    items: false
}

export default function taskReducer(state = defaultState, action) {
    switch (action.type) {
        case ADD_TASK:
            return {
                ...state,
                item: action.payload
            }
        case SET_TASK:
            return {
                ...state,
                items: action.payload
            }    
        case DELETE_TASK:
            return {
                ...state,
                items: action.payload
            }     
        case UPDATE_TASK:
            return {
                ...state,
                items: action.payload
            }    
        case INFO_TASK:
            return {
                ...state,
                items: action.payload
            }                                       
        default:
            return action
    }
}


export const addTask = task => ({type: ADD_TASK, payload: task})
export const setTask = tasks => ({type: SET_TASK, payload: tasks})
export const deleteTask = tasks => ({type: SET_TASK, payload: tasks})
export const updateTask = tasks => ({type: UPDATE_TASK, payload: tasks})
export const infoTask = tasks => ({type: INFO_TASK, payload: tasks})