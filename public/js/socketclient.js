var vote = function(elem) {
	var vote;
	console.log(elem);
	var className = elem.classList[1];
	var id = elem.id.split(".");
	if (className.indexOf('up') != -1) {
		vote = 'upvote';
		if (document.getElementsByClassName('upvotecolor').length > 0) {
			elem.classList.remove('upvotecolor');
			socket.emit('unvote', {voteDir: vote, videoId: id[1]});

		} else if (document.getElementsByClassName('downvotecolor').length > 0) {
			elem.classList.add('upvotecolor');
			document.getElementById("thumbs-down." + id[1]).classList.remove('downvotecolor');
			socket.emit('vote', {voteDir: vote, videoId: id[1]});
			socket.emit('unvote', {voteDir: 'downvote', videoId: id[1]});
		} 
		else {
			elem.classList.add('upvotecolor');
			socket.emit('vote', {voteDir: vote, videoId: id[1]});
		}
	} else {
		vote = 'downvote';
		if (document.getElementsByClassName('downvotecolor').length > 0) {
			elem.classList.remove('downvotecolor');
			socket.emit('unvote', {voteDir: vote, videoId: id[1]});
		} else if (document.getElementsByClassName('upvotecolor').length > 0) {
			elem.classList.add('downvotecolor');
			document.getElementById("thumbs-up." + id[1]).classList.remove('upvotecolor');
			socket.emit('vote', {voteDir: vote, videoId: id[1]});
			socket.emit('unvote', {voteDir: 'upvote', videoId: id[1]});
		} 
		else {
			elem.classList.add('downvotecolor');
			socket.emit('vote', {voteDir: vote, videoId: id[1]});
		}
	}
	console.log(vote);
};

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
		/*var usernameInput = document.querySelector('.usernameInput');*/
		var chatArea = document.querySelector('.chatArea')
		var messages = document.querySelector('.messages');

		var username = random_username();
		var connected = false;
		/*var usernameSubmit = document.querySelector('.usernameSubmit');*/
		var messageSubmit = document.querySelector('.messageSubmit');
		/*usernameSubmit.onclick = setUsername;*/
		messageSubmit.onclick = messageSend;

		var urlinput = document.querySelector('.form-control');
		var urlbutton = document.querySelector('.urlbutton');
		urlbutton.onclick = submitUrl;

		var videoUrlInput = document.querySelector('#video-url')
		var videoSubmit = document.querySelector('#submit-video');
		videoSubmit.onclick = submitVideo;

		socket.emit('join room', {roomName: document.body.dataset.room, userName: username});

		messageInput.onkeypress = function(event) {
			//enter key is 13
			if (event.keyCode == 13) {
				event.cancelubble = true;
				event.returnValue = false;
				event.preventDefault();
				event.stopPropagation();

				messageSend();
			}
		}

		function messageSend() {
			var message = messageInput.value;
			socket.emit('send msg', {username: username, msg: message});
			messageInput.value = "";
			//addMessage(username, message);
		}

/*		usernameInput.onkeypress = function(e) {
			if (e.keyCode == 13) {
				setUsername();
			}
		}*/

		function submitUrl() {
			var url = urlinput.value;
			console.log(url);
			socket.emit('add video', {videoURL: url});
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
			videoUrlInput.value = "";
		}

		socket.on('video voted', function(data) {
			var points = data.points;
			var id = data.videoId;
			var counterOfReturnedObject = document.querySelector("thumbs-up." + id).parentNode.children[1].innerHTML = points;
		});
	});
}) ();




function random_username(){
  var adjs = ["autumn", "hidden", "bitter", "misty", "silent", "empty", "dry",
  "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring",
  "winter", "patient", "twilight", "dawn", "crimson", "wispy", "weathered",
  "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green",
  "long", "late", "lingering", "bold", "little", "morning", "muddy", "old",
  "red", "rough", "still", "small", "sparkling", "throbbing", "shy",
  "wandering", "withered", "wild", "black", "young", "holy", "solitary",
  "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine",
  "polished", "ancient", "purple", "lively", "nameless"]

  , nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea",
  "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn",
  "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird",
  "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower",
  "firefly", "feather", "grass", "haze", "mountain", "night", "pond",
  "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf",
  "thunder", "violet", "water", "wildflower", "wave", "water", "resonance",
  "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper",
  "frog", "smoke", "star"];

  return adjs[Math.floor(Math.random()*(adjs.length-1))]+"_"+nouns[Math.floor(Math.random()*(nouns.length-1))];
}
