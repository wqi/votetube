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




