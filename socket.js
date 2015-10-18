// Environment Initialization
var io = require('socket.io');

// Business Logic
var socket = new io.Socket();
socket.connect("http://votetube.cloudapp.net:1337");

socket.on('connect', function() {
	console.log('Client connected to server');
});
 
socket.on('message',function(data) {
  console.log('Received a message from the server',data);
});

socket.on('disconnect',function() {
  console.log('Client has disconnected!');
});




