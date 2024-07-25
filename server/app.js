import express from 'express';
import {Server} from 'socket.io';
import {createServer} from 'http';
const app = express();

let port = 3000;

const server = createServer(app);
const io = new Server(server,{
    cors:true
});

app.get('/',(req,res)=>{
    res.send('hello bhaiya');
})

io.on('connection',(socket)=>{
    console.log('user connected');
    console.log('socket id = ', socket.id);
    // socket.emit('server-message',`Welcome to the server, r ${socket.id}`);
    socket.broadcast.emit('server-message',`User ${socket.id} joined the server`);
    // socket.broadcast.emit('chat')
    socket.on('receive-message',(m)=>{
        socket.to(m.room).emit('chat',m);
    })
    socket.on('disconnect',()=>{
        console.log('USER disconnected ------------ ', socket.id);
    })
    
})

server.listen(port, ()=>{
    console.log('server is listening at port : ', port);
})