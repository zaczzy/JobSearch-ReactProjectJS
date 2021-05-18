// socket.io
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:7000');

// sokcet io
function sendMessage(otherId) {
  console.log('Client sending sendMessage');
  socket.emit('sendMessage', otherId.toString());
}

export { sendMessage };
