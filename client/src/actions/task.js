import axios from 'axios'
import {setTask, addTask, deleteTask, infoTask} from "../reducers/taskReducer";
import {API_URL} from "../config";

export const add = (task, description, taskItem) => {
    return async dispatch => {

        if(task.trim().length === 0) return alert("Fill in the Name task field")
        try {
            const response = await axios.post(`${API_URL}api/task/add`, {
                task,
                description
            },{
               headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })
            dispatch(addTask(response.data))
        } catch (e) {
            alert(e.response.data.message)  
        }
    }
}

export const get = () => {
    return async dispatch => {

        try {
            const response = await axios.post(`${API_URL}api/task/get`, {

            },{
                headers:{Authorization:`Bearer ${localStorage.getItem('token')}`},
            })
            dispatch(setTask(response.data))
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}

export const update = (task, description, task_id) => {
    return async dispatch => {

        if(task.trim().length === 0) return alert("Fill in the Name task field")

        try {
            const response = await axios.post(`${API_URL}api/task/update`, {
                task,
                description,
                task_id
            },{
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })
            dispatch(setTask(response.data))
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}

export const taskDelete = (task_id) => {
    return async dispatch => {

        try {
            const response = await axios.post(`${API_URL}api/task/delete`, {
                task_id
            },{
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })
            dispatch(deleteTask(response.data))
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}

export const setInfo = (item) => {
    return async dispatch => {

        try {
            dispatch(infoTask(item))
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}