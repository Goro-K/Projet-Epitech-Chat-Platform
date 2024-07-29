import {setUsername} from '../socket/controllers/usersController.js'
import {sendMessage, sendPrivateMessage} from '../socket/controllers/messagesController.js'
import {createChannel, renameChannel, deleteChannel, joinChannel, quitChannel, listChannels} from '../socket/controllers/channelsController.js'


const sockets = (socket) => {

  // User events
  socket.on("/nick", (data) => setUsername(socket, data));

  // Channel events
  socket.on("/list", (data) => listChannels(socket, data));
  socket.on("/create", (data) => createChannel(socket, data));
  socket.on("/rename", (data) => renameChannel(socket, data));
  socket.on("/delete", (data) => deleteChannel(socket, data));
  socket.on("/join", (data) => joinChannel(socket, data));
  socket.on("/quit", (data) => quitChannel(socket, data));
  
  // Message events
  socket.on("/msg", (data) => sendPrivateMessage(socket, data));
  socket.on("message", (data)=> sendMessage(socket, data)); // Pour les messages de canal
};

export default sockets;