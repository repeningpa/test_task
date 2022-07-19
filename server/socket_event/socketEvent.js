const dbCon = require("../services/dbCon")
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const socketEvent = (socket) => {

    socket.on('auth:login', ({email, password}) => {
        dbCon.get('select u.user_id as user_id, u.password as password, u.email as email from users u where u.email = ?', email, async (err, result) => {
            if (err) console.log(err)
            else {
                if(result){
                    const isPassValid = bcrypt.compareSync(password, result.password);
                    if(isPassValid){
                        const token = jwt.sign({id: result.user_id}, config.get('secretKey'), {expiresIn: '1h'});
                        // socket.to(email).emit('auth:get', {
                        return socket.emit('auth:get', {
                            token,
                            user: {
                                id: result.user_id,
                                email: email
                            },
                            error: null
                        })
                    } 
                    return socket.emit('auth:get', {
                        error: 'Invalid password'
                    })
                } else {
                    return socket.emit('auth:get', {
                        error: 'User not Found'
                    })
                }
            }
        })
    })

    socket.on('auth:registration', async ({email, password}) => {
        const hashPassword = await bcrypt.hash(password, 8);
        dbCon.get('insert into users(email, password)  values(?, ?) returning user_id as user_id', email, hashPassword, (err, result) => {
            if (err) console.log(err)
            else {
                const token = jwt.sign({id: result.user_id}, config.get('secretKey'), {expiresIn: '1h'});
                // socket.to(email).emit('auth:get', {
                socket.emit('auth:get', {
                    token,
                    user: {
                        id: result.user_id,
                        email: email
                    },
                    error: null
                }) 
            }
        })   
    })    

    socket.on('task:get', ({user_id}) => {
        dbCon.all('select t.task_id as task_id, t.date_modify as date_modify, t.task_name as task_name , t.description as description from task t where t.user_id = ?;', user_id, (err, result) => {
            if (err) console.log(err)
            else socket.emit('task:send', result) 
        })
    })    

    socket.on('task:delete', ({task_id}) => {
        dbCon.run('DELETE from task where task_id = ?;', task_id, (err) => {
            if (err) console.log(err)
        })
    })   

    console.log('user connected', socket.id)
}

module.exports = socketEvent
