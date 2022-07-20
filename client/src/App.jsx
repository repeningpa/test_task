import React, {useEffect} from 'react'
import './App.css'
import {Route, Routes, Navigate} from 'react-router-dom'
import Login from './components/authorization/Login'
import Main from './components/main/Main'
import Task from './components/task/Task'
import {useDispatch, useSelector} from 'react-redux'
import {auth} from './actions/user'

function App() {

  	const isAuth = useSelector(state => state.user.isAuth)
	const dispatch = useDispatch()

  	useEffect(() => {
      	dispatch(auth())
    }, [])

	return (
		<div className='App'>
			<div className='wrap'>
				<Routes>
					{!isAuth && <Route path='/main' element={<Navigate replace to='/login' />}/>}                      
					{!isAuth && <Route path='/task' element={<Navigate replace to='/login' />}/>}                                  
					{isAuth && <Route path='/login' element={<Navigate replace to='/main' />}/>}
					{!isAuth && <Route path='/' element={<Navigate replace to='/login' />}/>} 
					{isAuth && <Route path='/' element={<Navigate replace to='/main' />}/>}                       
					<Route path='/main' element={<Main />}/>        
					<Route path='/task' element={<Task />}/>                    
					<Route path='/login' element={<Login />}/>            
				</Routes>
			</div>
		</div>
	);
}

export default App;
