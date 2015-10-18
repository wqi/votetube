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
		messageSubmit.onclick = messageSend;

		var urlinput = document.querySelector('.form-control');
		var urlbutton = document.querySelector('.urlbutton');
		urlbutton.onclick = submitUrl;

		var thumbsUp = document.getElementsByClassName("fa-thumbs-up")[0];
		var thumbsDown = document.getElementsByClassName("fa-thumbs-down")[0];
		thumbsUp.onclick = vote;
		thumbsDown.onclick = vote;

		var videoUrlInput = document.querySelector('#video-url')
		var videoSubmit = document.querySelector('#submit-video');
		videoSubmit.onclick = submitVideo;

		var socket = io('127.0.0.1:1337');

		messageInput.onkeypress = function(event) {
			//enter key is 13
			if (event.keyCode == 13) {
				messageSend();
			}
		}

		function messageSend() {
			var message = messageInput.value;
			socket.emit('send msg', {username: username, msg: message});
			messageInput.value = "";
			//addMessage(username, message);
		}

		usernameInput.onkeypress = function(e) {
			if (e.keyCode == 13) {
				setUsername();
			}
		}

		function vote() {
			var vote;
			console.log(this);
			var className = this.classList[1];
			if (className.indexOf('up') != -1) {
				vote = 'upvote';
				if (document.getElementsByClassName('upvotecolor').length > 0) {
					this.classList.remove('upvotecolor');
					socket.emit('unvote', {voteDir: vote});

				} else if (document.getElementsByClassName('downvotecolor').length > 0) {
					this.classList.add('upvotecolor');
					document.querySelector('.fa-thumbs-down').classList.remove('downvotecolor');
					socket.emit('vote', {voteDir: vote});
					socket.emit('unvote', {voteDir: 'downvote'});
				} 
				else {
					this.classList.add('upvotecolor');
					socket.emit('vote', {voteDir: vote});
				}
			} else {
				vote = 'downvote';
				if (document.getElementsByClassName('downvotecolor').length > 0) {
					this.classList.remove('downvotecolor');
					socket.emit('unvote', {voteDir: vote});
				} else if (document.getElementsByClassName('upvotecolor').length > 0) {
					this.classList.add('downvotecolor');
					document.querySelector('.fa-thumbs-up').classList.remove('upvotecolor');
					socket.emit('vote', {voteDir: vote});
					socket.emit('unvote', {voteDir: 'upvote'});
				} 
				else {
					this.classList.add('downvotecolor');
					socket.emit('vote', {voteDir: vote});
				}
			}
			console.log(vote);
		}

		function submitUrl() {
			var url = urlinput.value;
			console.log(url);
			socket.emit('add video', {videoURL: url});
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

		function submitVideo() {
			var toSend = {
				'videoURL': videoUrlInput.value
			}
			console.log(toSend);
			socket.emit('add video', toSend);
		}

		socket.on('video list', function(data) {
			var sorted = sortVideos(data);
			var length = Object.keys(sorted).length;
			$('.voting').empty();
			for (var i=0; i++; i<length) {
				generateVoteEntry();
				var id = sorted[i].split('?v=')[1].split('&')[0];
				getVideoInfo(id, updateVoteEntry, i);		
			}
		});
	});
}) ();




