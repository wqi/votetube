var socket = io('http://votetube.cloudapp.net:1337');

socket.on('sync video', function() {
	console.log('Video synced');
});
 
// socket.on('message',function(data) {
//   console.log('Received a message from the server',data);
// });

socket.on('connect',function() {
  console.log('Client has connected!');
});

$(function() {
	$('#submit-video').click(function() {
		var toSend = {
			'videoURL': $('#video-url').val();
		}
		socket.emit('video added', toSend);
	});
});

socket.on('video list', function(data) {
	var sorted = sortVideos(data);
	var length = Object.keys(sorted).length;
	$('.voting').empty();
	// for (var i=0; i++; i<length) {
	// 	generateVoteEntry();
	// 	var id = sorted[i].split('?v=')[1].split('&')[0];
		
	// }
})