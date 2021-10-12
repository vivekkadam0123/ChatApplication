const users = [];                                         //every user will be stored in array users in the form of object that contains id,username,room

//join user to chat
function userdetails(id, username, room) {
  const user = { id, username, room };

  users.push(user);                                        //pushed in array
  return user;
}

//get current user
function currentuser(id) {                                 //when we send/receive message we need to specipy name of sender
  return users.find((user) => user.id === id);
}

//when user leaves/disconnects
function leave(id) {                                        //when user leaves other users should come to know who left
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];                       //read about splice function stackoverflow
  }
}

//get room members
function roomusers(room) {                                 //we need to display current active users on left side
  return users.filter((user) => user.room === room);
}

module.exports = { userdetails, currentuser, leave, roomusers };
