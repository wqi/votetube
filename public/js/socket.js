var socket = io('votetube.cloudapp.net:1337');

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
	var sorted = sortVideos(data);
	console.log(sorted);
	$('.voting').empty();
	for (var i=0; i<sorted.length; i++) {
		generateVoteEntry();
		var id = sorted[i].split('?v=')[1].split('&')[0];
		getVideoInfo(id, updateVoteEntry, i);
	}
});

socket.on('video added', function(data) {
	generateVoteEntry();
	var id = data.url.split('?v=')[1].split('&')[0];
	getVideoInfo(id, updateVoteEntry, videoQueue.length);
})

socket.on('video ended', function(data) {
	for (var i=0; i<videoQueue.length; i++) {
		if (videoQueue[i].id == data.videoId) {
			videoQueue.splice(i, 1);
			console.log(videoQueue);
			$('.voting').empty();
			for (var j=0; j<videoQueue.length; j++) {
				generateVoteEntry();
				var id = videoQueue[j].id;
				getVideoInfo(id, updateVoteEntry, j);
			}
			return;
		}
	}
});

socket.on('video voted', function(data) {
	for (var i=0; i<videoQueue.length; i++) {
		if (videoQueue[i].id == data.videoId) {
			$('.video-entry:nth-child(' + (i+1) + ')').children('.counter').text(data.points);
		}
	}
});