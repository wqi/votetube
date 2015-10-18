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
var YouTube = require('youtube-node');
var yt = new YouTube();
var key = require('./key.js');

var url = require('url');

var moment = require('moment');

yt.setKey(key.youtube);


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


function User(socketId, name) {
	this.socketId = socketId;
	this.name = name;
}

function Video(videoURL) {
	this.points = 0;
	this.url = videoURL;
	this.name; // TODO: fetch video name somehow
	this.uploader;
	this.length;
	this.votedUsers = [];
}

function Room() {
	this.roomName;
	this.users = [];
	this.videos = {};
	this.currentVideo = null;
	this.currentTime = 0;
	this.intervalObject;
}


var rooms = {};

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
		if (rooms[roomName] != null) {
			room = rooms[roomName];
			socket.join(room.roomName);

		} else {
			room = new Room();
			room.roomName = data.roomName;
			room.users.push(user);
			rooms[roomName] = room;
			// send sync event
			room.intervalObject	= setInterval(updateRoom, 10000, room);
		}

		socket.emit('video list', room.videos);
		console.log(room.videos);
	});

	socket.on('add video', function (data) {
		if (!room || !user) {
			return;
		}


		if (data.videoURL in room.videos) {
			socket.emit("error", "Video has already been submitted.");
			return;
		}
		console.log("adding video: " + data.videoURL);
		// TODO: check/sanitize user input
		var video = new Video(data.videoURL);

		yt.getById(url.parse(video.url, true).query.v, function(err, res) {
			if (err) {
				// TODO: handle error
				console.log('error');
				return;
			} else {
				video.name = res.items[0].snippet.title;
				video.length = moment.duration(res.items[0].contentDetails.duration).asSeconds();
				video.uploader = res.items[0].snippet.channelTitle;
				room.videos[video.url] = video;
				io.to(room.roomName).emit('video added', video);
				console.log(room.videos);
			}
		});
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
			console.log(room.videos);
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
				video.votedUsers.splice(userIndex, 1);
			}

			io.to(room.roomName).emit("video voted", video);
		} else {
			var msg = "You have not voted yet, you cannot unvote!";
			socket.emit("error", msg);
		}
	});

	socket.on('send msg', function (data) {
		var chatMessage = {
			username: user.name,
			msg: data.msg
		}
		io.to(room.roomName).emit('receive msg', chatMessage);
	});

});

function updateRoom (room) {
	var sync = {
		videoUrl: "",
		timestamp: 0
	};

	console.log('sending sync');

	if (room.currentVideo !== null) {
		// already past end of video, update with next video
		if (room.currentTime + 10 > room.currentVideo.length) {
			room.currentVideo = null;
		}
	}

	// get new video if no current video
	if (room.currentVideo === null) {
		console.log(_.size(room.videos));
		if (_.size(room.videos) > 0) {
			// Number.MIN_SAFE_INTEGER = most negative number
			// need to account for negative voted videos too
			var max = {points: Number.MIN_SAFE_INTEGER};
			for (var k in room.videos) {
				room.videos[k].points > max.points ? max = room.videos[k] : max = max;
			}

			delete room.videos[max.url];

			room.currentVideo = max;
			room.currentTime = 0;
			sync.videoUrl = room.currentVideo.url;
			sync.timestamp = 0;
		} else {
			sync.videoUrl = null;
			sync.timestamp = -1;
		}
	} else {
		// currently playing video, update timestamp
		room.currentTime += 10;
		sync.videoUrl = room.currentVideo.url;
		sync.timestamp = room.currentTime;
	}

	console.log(sync);

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
