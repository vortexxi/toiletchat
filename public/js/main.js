//client side
const boxChat = document.getElementById('chatBox');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users')
const chatMessages = document.querySelector('.chat-messages');
const socket = io();

//to get info fom the url
const {username, room} = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});

//join to chat room
socket.emit('joinRoom', {username, room});

//get room and users info
socket.on('roomUsers', ({ room, users}) => {
	OutputRoomName(room);
	outputUsers(users);
});

//message from server
socket.on('message', message => {
	console.log(message);
	outputMessage(message);
	//scroll each a messages is recieved
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

//sending a message
boxChat.addEventListener('submit', (e) => {
	//prevent default behavior
	e.preventDefault();
	//get the message from the input text tag
	const mssg = e.target.elements.msg.value;
	//clear text box
	//The focus() method is used to give focus to an element (if it can be focused).
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
	//send to the server 
	socket.emit('textMessage', mssg);
	//console.log(mssg);

})

//message to DOM
function outputMessage(message){
	const div = document.createElement('div');
	//add the "message" class
	div.classList.add('messages');
	div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p><br>
						<p class="text">
							${message.text}
						</p>`;
	//The querySelector() method returns the first element that matches a specified CSS selector(s) in the document.
	//The appendChild() method appends a node as the last child of a node
	document.querySelector('.chat-messages').appendChild(div);
}

//add room name into DOM
function OutputRoomName(room){
	// roomName.innerText = room;
	roomName.innerHTML = `<span style="color: var(--light-slate)"> ${ room } </span>`;
}
// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.classList.add('lista');
    // li.innerText = user.username;
    li.innerHTML = `<span style="color: var(--light-slate)">${ user.username }</span>`;
    userList.appendChild(li);
  });
}

