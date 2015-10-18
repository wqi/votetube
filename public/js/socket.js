var socket = io('127.0.0.1:1337');

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