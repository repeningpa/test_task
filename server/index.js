const express = require('express')
const config = require('config')
const authRouter = require('./routes/auth.routes')
const taskRouter = require('./routes/task.routes')
const port = config.get('serverPort');
const corsMiddleware = require('./middleware/cors.middleware')
const DB = config.get('dbPath')
const app = express()

app.use(corsMiddleware)
app.use(express.static('static'))
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/task', taskRouter);

const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { 
    cors: {    
        origin: '*',    
        methods: ['GET', 'POST']  
    }
})
const socketEvent = require('./socket_event/socketEvent')

io.on('connection', (socket) => {
    socketEvent(socket)
})

const start = async () => {
    try {
        server.listen(port, () => {
            console.log('Server started on port', port);
        });
    } catch (e) {
        console.log(e)
    }
}

start();
