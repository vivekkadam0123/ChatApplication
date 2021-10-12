const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const defaultmsg = require("./ourmodules/module1");
const {userdetails, currentuser, leave, roomusers,} = require("./ourmodules/module2");

const app = express();
const server = http.createServer(app);
const io = socketio(server);                                                     //initialize the variable io

//set static folder
app.use(express.static(path.join(__dirname, "public")));

const defaultname = "WeChat";                             //default user name for welcome,user left,user joined



//run when client connects
io.on("connection", (socket) => {

  socket.on("newuser", ({ username, room }) => { 

    const user = userdetails(socket.id, username, room);                    //it will go to module2
    socket.join(user.room);

    //console.log("welcome to wechat");                                     //prints on server side i.e. terminal

    //welcome new user
    socket.emit("message", defaultmsg(defaultname, "Welcome to WeChat!")); //it will emit to single client

    //broadcast when user connects
    socket.broadcast.to(user.room).emit("message",defaultmsg(defaultname, `${user.username} has joined the chat`));   //it will emit to everyone except the user who is connecting

    //io.emit();                                                            //it will emit to all clients

    //send users and room on left side
    io.to(user.room).emit("addleft", {room: user.room, users: roomusers(user.room),});
  });

  
  
  //listen to chatmsg
  socket.on("send", (msg) => {

    //console.log(msg);                                               //it will show it on terminal(server side)

    const user = currentuser(socket.id);                              //it will go to module2

    socket.broadcast.to(user.room).emit("receive", defaultmsg(`${user.username}`, msg));
    socket.emit("sended", defaultmsg(`${user.username}`, msg));       //no need to use .to(user.room) because socket.emit will emit to single(current) user

  });



  //when user disconnects
  socket.on("disconnect", () => {
    const user = leave(socket.id);                                    //it will go to module2
    if (user) {
      io.to(user.room).emit("message",defaultmsg(defaultname, `${user.username} has left the chat`));

      //send users and room on left side
      io.to(user.room).emit("addleft", {room: user.room, users: roomusers(user.room),});
    }
  });
  
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
