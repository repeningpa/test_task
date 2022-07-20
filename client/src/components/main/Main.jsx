import React, { useState, useEffect } from 'react';
import './main.css'
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../reducers/userReducer';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPen, faUser } from '@fortawesome/free-solid-svg-icons'
import {setInfo} from '../../actions/task';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket';

const Main = () => {
  	const dispatch = useDispatch()

  	const user = useSelector(state => state.user.currentUser)

  	const [task, setTask] = useState([])

  	const tableHeader = [
		'TaskId',
		'Name',
		'Date',
		'Description',
		'Action'
  	]

	useEffect(() => {
		socket.emit('task:get', {user_id: user.id})

		socket.on('task:send', (data) => { 
			setTask(data)
		})

		return () => {
			socket.removeAllListeners('task:send');
		}
	}, [])


	let navigate = useNavigate(); 
	const routeChange = (item) => { 
		let path = `/task`
		navigate(path)
		if(item.task_id) dispatch(setInfo(item))
		else {
			let iNull = {
				task_name: null,
				description: null,
				date_modify: null,
				task_id: null
			}
			dispatch(setInfo(iNull))
		}
	}

	const taskDelete = (task_id) => { 
		setTask(task.reduce((aggr, row) => {
			if (row.task_id !== task_id) {
				aggr.push(row);
			}
			return aggr;
		}, []))

		socket.emit('task:delete', {task_id, user_id: user.id})
	}

	return (
		<>
			<Card>
				<Card.Header>
					<Navbar>
						<Container>
							<Navbar.Brand>
								<Button variant='danger' size='sm' onClick={() => dispatch(logout())}>logout</Button>{' '}
								<Button variant='success' size='sm' onClick={routeChange}> add task </Button>
							</Navbar.Brand>
							<Navbar.Toggle />
							<Navbar.Collapse className='justify-content-end'>
								<Navbar.Text>
									{user.email} <FontAwesomeIcon icon={faUser}/>
								</Navbar.Text>
							</Navbar.Collapse>
						</Container>
					</Navbar> 
				</Card.Header>
				<Card.Body>
					<div className='table-wrapper'>
						<table>
							<thead>
								<tr>
									{
										tableHeader.map(item => (
										<th key={item}>{item}</th>
										))
									} 
								</tr>
							</thead>
							<tbody>  
								{
									task.map(item => (
										<tr key={item.task_id} className='rows'>
											<td>{item.task_id}</td>
											<td className='name-pointer-td' onClick={() => routeChange(item)} >{item.task_name}</td>
											<td>{item.date_modify}</td>
											<td>{item.description}</td>
											<td className='fa-margin-td'>
												<FontAwesomeIcon icon={faPen} className='fa-pointer-edit' onClick={() => routeChange(item)}/> 
												<span className='fa-mragin-span'></span>
												<FontAwesomeIcon icon={faTrash} className='fa-pointer-delete' onClick={() => taskDelete(item.task_id)} />
											</td>
										</tr>
									))
								} 
							</tbody>
						</table>
					</div>
				</Card.Body>
			</Card>
		</>
	);
};

export default Main;