const socket = io();
const chatform = document.getElementById("form");
const display = document.querySelector(".display");
const roomname = document.getElementById("roomname");
const activeusers = document.querySelector(".list");


//get username and room from url
const { username, room } = Qs.parse(location.search, {                     //we used qs library and a method called parse
  ignoreQueryPrefix: true,                                                //to ignore symbols and other characters from url
});
console.log(username)
socket.emit("newuser", { username, room });                               


//message from server
socket.on("message", (message) => {
  //console.log(message);                                                //prints object on client server
  defaultmessage(message);
  display.scrollTop = display.scrollHeight;                              //scroll automatically down when lot of messages
});


//when user submit(send) a message
chatform.addEventListener("submit", (e) => {
  e.preventDefault();                                                   //when we submit a form it automatically submits it to a file, so to prevent it (default behaviour) we use this statement
  const msg = message.value;                                            //message class from form
  //console.log(msg);
  socket.emit("send", msg);
});


//when I send a message I should see it on right side
socket.on("sended", (msg) => {
  displaymymessage(msg);                                                //display-my-message function show us message on right side that we have sended
  display.scrollTop = display.scrollHeight;                             //scroll automatically down when lot of messages
  message.value = "";                                                   //after sending message it becomes blank
  //message.focus();                                                    //autofocus
});


//when I send a message everyone should receive it on left side
socket.on("receive", (msg) => {
  //console.log(message);
  displaymessage(msg);                                                   //display-message function show other message on left side that user have received
  display.scrollTop = display.scrollHeight;                              //scroll automatically down when lot of messages
});


function defaultmessage(message) {
  const div = document.createElement("div");                             //create div inside class display (see chat.html)
    
  div.classList.add("center");                                             //adds properties of center class and gives its css properties to message                                        
  //properties of center class are given to our newly created div as whole but here we want to separate styling properties to above part and below part of message therefore we included class centerup and class centerdown directly
  div.innerHTML = `<p class="centerup">${message.username}-<span>${message.time}</span></p><hr>   
                   <p class="centerdown">${message.text}</p>`;
  document.querySelector(".display").appendChild(div);                  //appends div inside class display
}


//output message to DOM
function displaymessage(message) {
  const div = document.createElement("div");                             //create div inside class display (see chat.html)

  div.classList.add("msg");                                             //adds properties of msg class and gives its css properties to message
  div.classList.add("lefthand");                                        //adds properties of lefthand class and gives its css properties to message
  //properties of msg and lefthand class are given to our newly created div as whole but here we want to separate styling properties to above part and below part of message therefore we included class up and class down directly
  div.innerHTML = `<p class="up">${message.username}-<span>${message.time}</span></p><hr>   
                   <p class="down">${message.text}</p>`;
  document.querySelector(".display").appendChild(div);                  //appends div inside class display
}


function displaymymessage(message) {                                    //create div inside class display (see chat.html)
  const div = document.createElement("div");

  div.classList.add("msg");                                            //adds properties of msg class and gives its css properties to message
  div.classList.add("righthand");                                      //adds properties of righthand class and gives its css properties to message

  div.innerHTML = `<p class="up">${message.username}-<span>${message.time}</span></p><hr>
          <p class="down">${message.text}</p>`;
  document.querySelector(".display").appendChild(div);
}

//get room and users
socket.on("addleft", ({ room, users }) => {
  //console.log(message);
  displayroom(room);
  displayusers(users);
});

//to add roomname
function displayroom(room) {
  roomname.innerHTML = room;                                        //put value of room in roomname(it is id) (see chat.html)
}

//to add users
function displayusers(users) {                                                            //users will have separate object for users which contains id,username,room
  activeusers.innerHTML= `${users.map(user => `<li>${user.username}</li>`).join('')}`;    //from that object we want to print only usernames of all the objects
}










