/*************************************
//
// votetube app
//
**************************************/

// express magic
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);
var device  = require('express-device');

var runningPortNumber = process.env.PORT || 1337;
var _ = require('lodash');


app.configure(function(){
	// I need to access everything in '/public' directly
	app.use(express.static(__dirname + '/public'));

	//set the view engine
	app.set('view engine', 'ejs');
	app.set('views', __dirname +'/views');

	app.use(device.capture());
});


// logs every request
app.use(function(req, res, next){
	// output every request in the array
	console.log({method:req.method, url: req.url, device: req.device});

	// goes onto the next function in line
	next();
});

app.get("/", function(req, res){
	res.render('index', {roomName: 'root'});
});

app.get("/:roomName", function(req, res) {
	res.render('index', {roomName: req.params.roomName});
})


io.sockets.on('connection', function (socket) {

	io.sockets.emit('blast', {msg:"<span style=\"color:red !important\">someone connected</span>"});

	socket.on('blast', function(data, fn){
		console.log(data);
		io.sockets.emit('blast', {msg:data.msg});

		fn();//call the client back to clear out the field
	});

});






function User(socketId, name) {
	this.socketId = socketId;
	this.name = name;
}

function Video(url) {
	this.points = 0;
	this.url = url;
	this.name; // TODO: fetch video name somehow
	this.uploader;
	this.length;
	this.votedUsers = [];
}



function Room() {
	this.roomName;
	this.users = {};
	this.videos = {};
	this.currentVideo = null;
	this.currentTime;
	this.intervalObject;
}



io.on('connection', function (socket) {
	var user = null;
	var room = null;

	/*
  A client enters the room.
  {
    room_name: ''  ;; the room name that a client intends to join/create
    user_name: ''  ;; the client user's name
  }
  specify a call back:
  function callback(roomExists: boolean) { ... }
  */

  socket.on('join room', function (data) {
		var roomName = data.roomName;
		var userName = data.userName;

		console.log("user " + userName + " is joining " + roomName);

		if (!roomName || !userName) {
			return;
		}

		user = new User(socket.id, userName);

		// TODO: not working code
		if (room[roomName] != null) {
			room = rooms[roomName];
			socket.join(room.roomName);

		} else {
			room = new Room();
			room.roomName = data.roomName;

			// send sync event
			room.intervalObject	= setInterval(updateRoom, 10000, room);
		}

		socket.emit('video list', room.videos);
	});

	socket.on('add video', function (data) {
		if (!room || !user) {
			return;
		}

		// TODO: check/sanitize user input
		var video = new Video(data.videoURL);
		if (video.url in room.videos) {
			socket.emit("error", "Video has already been submitted.");
			return;
		}
		room.videos[video.url] = video;
		io.to(room.roomName).emit('video added', video);
	});

	socket.on('vote', function (data) {
		if (!room || !user) {
			return;
		}

		var video = room.videos[data.videoId];
		if (!_.contains(video.votedUsers, user)) {
			if (data.voteDir === "upvote") {
				video.points++;
			} else if (data.voteDir === "downvote") {
				video.points--;
			}
			video.votedUsers.push(user);
			io.to(room.roomName).emit("video voted", video);
		} else {
			var msg = "You have already voted, you cannot vote again!";
			socket.emit("error", msg);
		}
	});

	socket.on('unvote', function (data) {
		if (!room || !user) {
			return;
		}

		var video = room.videos[data.videoId];
		// ensure user has voted for this video
		if (_.contains(video.votedUsers, user)) {
			if (data.voteDir === "upvote") {
				video.points--;
			} else if (data.voteDir === "downvote") {
				video.points++;
			}

			// remove user from voted user list
			var userIndex = video.votedUsers.indexOf(user);
			if (userIndex > -1) {
				video.votedUsers.splice(index, 1);
			}

			io.to(room.roomName).emit("video voted", video);
		} else {
			var msg = "You have not voted yet, you cannot unvote!";
			socket.emit("error", msg);
		}
	});

	socket.on('msg', function (data) {
		var chatMessage = {
			username: user.name,
			msg: data.msg
		}
		io.to(room.roomName).emit('msg', chatMessage);
	});

});

function updateRoom (room) {
	var sync = {
		videoId: "",
		timestamp: 0
	};

	// get new video if no current video
	if (room.currentVideo === null) {
		if (_.size(room.videos) > 0) {
			// Number.MIN_SAFE_INTEGER = most negative number
			// need to account for negative voted videos too
			var max = {points: Number.MIN_SAFE_INTEGER};
			for (var k in room.videos) {
				room.videos[k].points > max.points ? max = room.videos[k] : max = max;
			}

			room.currentVideo = max;
		}
	} else {
		// currently playing video, update timestamp

		sync.timestamp += 10;
		// is time past end of video?
	}


	io.to(room.roomName).emit('sync video', sync);
}







function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


server.listen(runningPortNumber);
