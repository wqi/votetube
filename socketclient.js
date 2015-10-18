(function() {
	"use strict";

	function addLoadEvent(func) {
		var oldonload = window.onload;
		if (typeof window.onload != 'function') {
			window.onload = func;
		} else {
			window.onload = function() {
				if (oldonload) {
					oldonload();
				}
				func();
			}
		}
	}

	addLoadEvent(function() {
		var messageInput = document.querySelector('.messageInput');
		var usernameInput = document.querySelector('.usernameInput');
		var chatArea = document.querySelector('.chatArea')
		var messages = document.querySelector('.messages');

		var username;
		var connected = false;
		var usernameSubmit = document.querySelector('.usernameSubmit');
		var messageSubmit = document.querySelector('.messageSubmit');
		usernameSubmit.onclick = setUsername;

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
			if (usernameInput.value != "") {
				username = usernameInput.value;
				usernameInput.style.display = "none";
				usernameSubmit.style.display = "none";
				messageInput.style.display = "";
				messageSubmit.style.display = "";
			}
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
	});
}) ();




