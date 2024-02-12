const path = require('path');
//create server
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//static folder
app.use(express.static(path.join(__dirname, 'public')));

const admName = 'Toilet Chat';

//start socket io when de client side connects
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinRoom', ({username, room}) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    //emit a welcome message in the client side and join
    socket.emit('message', formatMessage(admName, 'Welcome to the chat'));
  socket.broadcast.to(user.room).emit('message', formatMessage(admName, `${user.username} has joined`));

  //send users and room information
  io.to(user.room || user.create).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room)
  });

  });
  

  //emit a message in the client side disconect
  socket.on('disconnect', () =>{
    const user = userLeave(socket.id);
    if(user){
  	io.to(user.room).emit('message', formatMessage(admName, `${user.username} has leaved toilet chat`));
      //update users and room information
  io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room)
  });
      }
  });

  //listeners
  //recieve message from client side
  socket.on('textMessage', mssg =>{
  	console.log(mssg)
    const user = getUser(socket.id);
  	//emit back to the client
  	io.to(user.room).emit('message', formatMessage(user.username, mssg));
  })

});

//port 3000 or search for an entry point available
const PORT = 3000 || process.env.PORT;


//run server
server.listen(PORT, () => console.log(`Toiletchat server runing on ${PORT}`));