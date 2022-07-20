import React, {useState} from 'react';
import './authorization.css'
import Input from '../../utils/input/Input';
import socket from '../../socket';
import { useEffect } from 'react';
import {setUser} from '../../reducers/userReducer';
import {useDispatch} from 'react-redux'
import { validate } from 'react-email-validator';

const error = {
	empty_email: 'Email is empty',
	email: 'Uncorrect email',
	empty_password: 'Password is empty',
	not_user: 'User not found',
	password: 'Invalid password'
}


const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errorMsg, setErrorMsg] = useState('')
	const [selectEmail, setSelectEmail] = useState('')
	const [selectPassword, setSelectPassword] = useState('')	
	const dispatch = useDispatch()

	const sendError = (errorText, typeSelect) =>  {
		setSelectPassword('')
		setSelectEmail('')
		if(typeSelect == 1) setSelectPassword('select-error-input')
		if(typeSelect == 2) setSelectEmail('select-error-input')		
		return setErrorMsg(errorText)
	}	

	const sendLogin = (email, password) =>  {
		if(!email) return sendError(error.empty_email, 2)
		if(!validate(email)) return sendError(error.email, 2)
		if(!password) return sendError(error.empty_password, 1)
		socket.emit('auth:login', {email, password})
	}

	const sendRegistration = (email, password) =>  {
		if(!email) return sendError(error.empty_email, 2)
		if(!validate(email)) return sendError(error.email, 2)
		if(!password) return sendError(error.empty_password, 1)
		socket.emit('auth:registration', {email, password})
	}	


	useEffect(() => {
		socket.on('auth:get', (data) => {
			if(data.error == null) {
				dispatch(setUser(data.user))
				localStorage.setItem('token', data.token)
			} else sendError(data.error, data.errorType)	
		})

		return () => {
			socket.removeAllListeners('auth:get');
		}
	}, [])

    return (
		<div className='form-structor'>
			<div className='signup'>
				<h2 className='form-title'><span>or</span>Sign in</h2>
				<div className='form-holder'>
					<Input value={email} setValue={setEmail} type='email' className={selectEmail} placeholder='Email...'/>
					<Input value={password} setValue={setPassword} type='password' className={selectPassword} placeholder='Password...'/>
				</div>
				<button className='submit-btn' onClick={() => sendLogin(email, password)}>Sign in</button>
				<button className='submit-btn' onClick={() => sendRegistration(email, password)}>Sign up</button>
				{/* <button className='submit-btn' onClick={() => dispatch(login(email, password))}>Войти</button>				 */}
				<div className='form-error'>{errorMsg}</div>
			</div>
			<div className='login slide-up'>
				<div className='center'>
					<h2 className='form-title'><span>or</span>Sign up</h2>
				</div>
			</div>            
		</div>
    );
};

export default Login;
