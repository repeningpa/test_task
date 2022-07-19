import React, {useState} from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import {add, update} from "../../actions/task";
import socket from '../../socket';

import './task.css'

const Task = () => {
    const info = useSelector(state => state.task.items)

    const user = useSelector(state => state.user.currentUser)

    const dispatch = useDispatch()

    let navigate = useNavigate(); 
    const routeChange = () => { 
      let path = `/main`
      navigate(path)
    }

    const addOrUpdate = () => { 
        if(info.task_id == null) dispatch(add(taskName, description))
        else dispatch(update(taskName, description, info.task_id))

        socket.emit('task:get', {user_id: user.id})
    }    

    const [taskName, setTaskName] = useState(info.task_name == null ? "" : info.task_name, "")
    const [description, setDescription] = useState(info.description == null ? "" : info.description, "")    

    return (
        <>
			<Card>
				<Card.Header>Task Editor</Card.Header>
				<Card.Body>
					<div className="card__body task">
						<Form>
							<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
								<Form.Label>Task Name</Form.Label>
								<Form.Control type="text" autoFocus onChange={(event) => setTaskName(event.target.value)} value={taskName} />
							</Form.Group>
							<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
								<Form.Label>Task Description</Form.Label>
								<Form.Control as="textarea" rows={3} type="text" onChange={(event) => setDescription(event.target.value)} value={description}/>
							</Form.Group>
						</Form>
					</div>
					<br/>
					<div>
						<Button variant="primary" size="sm" onClick={routeChange}>back</Button>{' '}
						<Button variant="success" size="sm" onClick={addOrUpdate}> save </Button>
					</div>      
				</Card.Body>
			</Card>
        </>
    )
}

export default Task
