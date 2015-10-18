var messageInput = document.querySelector('.inputMessage');
var usernameInput = document.querySelector('.usernameInput');
var chatArea = document.querySelector('.chatArea')
var messages = document.querySelector('.messages');

var username;
var connected = false;
var currentInput = usernameInput.focus();
var usernameSubmit = document.querySelector('.usernameSubmit');
usernameSubmit.onclick = setUsername;
messageInput.style.display = "none";

var socket = io();

messageInput.onkeypress = function(event) {
	//enter key is 13
	if (event.keyCode == 13) {
		var message = messageInput.value;
		socket.emit('send msg', {username: username, msg: message});
		messageInput.value = "";
		//addMessage(username, message);
	}
}

function setUsername() {
	username = usernameInput.value;
	usernameInput.style.display = "none";
	usernameSubmit.style.display = "none";
	messageInput.style.display = "initial";
	currentInput = messageInput.focus();
	console.log(username);
	//sessionStorage.setItem('username', username);
	socket.emit('join room', {roomName: 'default', userName: username});
}

function addMessage(username, message) {
	var element = document.createElement('li');
	element.innerHTML = username + ": " + message;
	messages.appendChild(element);
}

socket.on('receive msg', function(data) {
	var username = data.username;
	var msg = data.msg;
	addMessage(username, msg);
});




