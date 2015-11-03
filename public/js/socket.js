var socket = io('votetube.cloudapp.net');
var videoQueue = [];

socket.on('sync video', function(data) {
	console.log('Video synced');
	syncVideo(data.videoId, data.timestamp);
});

// socket.on('message',function(data) {
//   console.log('Received a message from the server',data);
// });

socket.on('connect',function() {
  console.log('Client has connected!');
});

//socket.emit('join room', {roomName: 'main', userName: 'asdf'});

socket.on('video list', function(data) {
	console.log(data);
	videoQueue = sortVideos(data);
	console.log(videoQueue);
	refreshQueue(videoQueue);
});

socket.on('video added', function(data) {
	videoQueue.push(data);
	videoQueue = insertionSortByPoints(videoQueue).reverse();
	refreshQueue(videoQueue);

	// generateVoteEntry();
	// var id = data.url.split('?v=')[1].split('&')[0];
	// getVideoInfo(, updateVoteEntry, videoQueue.length);
})

socket.on('video ended', function(data) {
	for (var i=0; i<videoQueue.length; i++) {
		if (videoQueue[i].id == data.videoId) {
			videoQueue.splice(i, 1);
			console.log(videoQueue);
			refreshQueue(videoQueue);
			return;
		}
	}
});

socket.on('video voted', function(data) {
	for (var i=0; i<videoQueue.length; i++) {
		if (videoQueue[i].id == data.videoId) {
			// $('.video-entry:nth-child(' + (i+1) + ')').children('.counter').text(data.points);
			videoQueue[i].points = data.points;
			break;
		}
	}
	refreshQueue(videoQueue);
});