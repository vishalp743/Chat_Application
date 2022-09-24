const socket = io();

 const chatform =document.getElementById('chat-form');
 const chatmessage = document.querySelector(".chat-messages");
 const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and rooom from query
const {username , room } =Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

//
//join chatform
socket.emit('joinroom', {username,room});
//get room and users
socket.on('roomusers', ({room, users})=>{
  outputroomname(room);
  outputusers(users);
});
//
socket.on('message', message =>{
  console.log(message);
  outputmessage(message);

  //scroll to bottmom
  chatmessage.scrollTop =chatmessage.scrollHeight;

})
//
//message submit
chatform.addEventListener('submit', (e)=>{
  e.preventDefault();

  //getting msg
  const msg = e.target.elements.msg.value;

  //sending msg to server
  socket.emit('chatMessage', msg);


  //clearing inpput
  e.target.elements.msg.value= '';
  e.target.elements.msg.focus= '';
})
//
//
function outputmessage(message)
{
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML= `<p class="meta">${message.username}<span style="margin-left:10px">${message.time}</span></p>
  <p class="text"><b>${message.text}<b></p>`;
  document.querySelector(".chat-messages").appendChild(div);
}


//add room name to dom
function outputroomname(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputusers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
