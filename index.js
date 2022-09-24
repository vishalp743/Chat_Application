const express = require('express');
const http = require('http');
const socketio =require('socket.io');
const path =require('path');
const formatmessage = require('./utils/messages');
const {userjoin, getuser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server =http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const chatbot = "ADMIN"

app.use(express.static("public"));



io.on('connection', (socket) => {

  socket.on('joinroom', ({username, room})=>{

    const user = userjoin(socket.id, username, room);
    socket.join(user.room);
    console.log(user.room);

    // Welcome current user
        socket.emit("message", formatmessage(chatbot, "Welcome to ChatCord!" ));

    // Broadcast when a user connects
        socket.broadcast.to(user.room).emit("message", formatmessage(chatbot,`${user.username} has joined the chat`));

        //send room info
        io.to(user.room).emit('roomusers', {
          room: user.room,
          users: getRoomUsers(user.room)
        } );

  });
//  console.log('new connection');

    socket.on("chatMessage", (msg) => {
      const currentuser = getuser(socket.id);
    io.to(currentuser.room).emit("message", formatmessage(currentuser.username,msg));
  });

//disconnect
      socket.on("disconnect", () => {

        const user = userLeave(socket.id);

        if(user){
          io.to(user.room).emit("message", formatmessage(chatbot,`${user.username} Left the chat`));

          //send room info
          io.to(user.room).emit('roomusers', {
            room: user.room,
            users: getRoomUsers(user.room)
          } );
        }



      });

});

server.listen(port, () => {
  console.log('listening on *:3000');
});
