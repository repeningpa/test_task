import React, {useState} from 'react';
import './authorization.css'
import Input from "../../utils/input/Input";
import socket from '../../socket';
import { useEffect } from 'react';
import {setUser} from "../../reducers/userReducer";
import {useDispatch} from "react-redux"
// import {login} from "../../actions/user"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
	const [errorMsg, setErrorMsg] = useState("")
	const dispatch = useDispatch()

	const sendLogin = (email, password) =>  {
		if(!email || !password) return alert("Uncorrect request")
		socket.emit('auth:login', {email, password})
	}

	const sendRegistration = (email, password) =>  {
		if(!email || !password) return alert("Uncorrect request")
		socket.emit('auth:registration', {email, password})
	}	

	useEffect(() => {
		socket.on('auth:get', (data) => {
			if(data.error == null) {
				dispatch(setUser(data.user))
				localStorage.setItem('token', data.token)
			} else setErrorMsg(data.error)
		})
	}, [])

    return (
		<div className="form-structor">
			<div className="signup">
				<h2 className="form-title"><span>or</span>Sign in</h2>
				<div className="form-holder">
					<Input value={email} setValue={setEmail} type="text" className="input" placeholder="Введите email..."/>
					<Input value={password} setValue={setPassword} type="password" className="input" placeholder="Введите пароль..."/>
				</div>
				<button className="submit-btn" onClick={() => sendLogin(email, password)}>Sign in</button>
				<button className="submit-btn" onClick={() => sendRegistration(email, password)}>Sign up</button>
				{/* <button className="submit-btn" onClick={() => dispatch(login(email, password))}>Войти</button>				 */}
				<div className="form-error">{errorMsg}</div>
			</div>
			<div className="login slide-up">
				<div className="center">
					<h2 className="form-title"><span>or</span>Sign up</h2>
				</div>
			</div>            
		</div>
    );
};

export default Login;
