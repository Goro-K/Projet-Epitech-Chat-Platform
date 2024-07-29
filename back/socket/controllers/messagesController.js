import Message from '../../models/Messages.js';
import Channel from '../../models/Channels.js';
import User from '../../models/Users.js';

export async function sendMessage(socket, data) {
  const channel = data.channel

  const fromUser = data.fromUser
  
  const userExistInChannel = data.channel.users.find(user => user.user === fromUser.userId);

  if (!userExistInChannel) {
    socket.emit("errorSocket", "Vous devez rejoindre le canal avant d'envoyer un message");
    return;
  }

  if(data.message === "") {
    socket.emit("errorSocket", "Vous ne pouvez pas envoyer un message vide");
    return;
  }
  
  const newMessage = new Message({
    from: fromUser.userId,
    text: data.message,
    channel: channel._id
  });

try {
  const savedMessage = await newMessage.save();

  await Channel.findByIdAndUpdate(channel._id, {
    $push: { messages: savedMessage._id }
  });

  await User.findByIdAndUpdate(fromUser.userId, {
    $push: { messages: savedMessage._id }
  });

  socket.emit("messageCreated", {from: fromUser.username, text: savedMessage.text, createdAt: savedMessage.createdAt, private: savedMessage.private, to: savedMessage.to});
} catch (error) {
  console.error('Error creating message:', error);
  socket.emit("errorSocket", error.message);
}

}

export async function sendPrivateMessage(socket, data) {
  const toUser = data.toUser;
  const message = data.message;
  const fromUser = data.fromUser;
  const channel = data.channel;

  console.log(channel.users)
  if( message === "") {
    socket.emit("errorSocket", "Vous ne pouvez pas envoyer un message vide");
    return;
  }

  // Vérifier si le destinataire existe
  const recipientUser = await User.findOne({ username: toUser });

  if (!recipientUser) {
    socket.emit("errorSocket", `L'utilisateur ${toUser} n'existe pas`);
    return;
  }

  if (!channel.users.find(user => user.user.toString() === recipientUser._id.toString())) {
    socket.emit("errorSocket", `L'utilisateur ${toUser} n'est pas dans le canal`);
    return;
  }  

  const newMessage = new Message({
    from: fromUser.userId,
    to: recipientUser._id,
    text: message,
    channel: channel._id,
    private: true
  });

  try {
    const savedMessage = await newMessage.save();

    await Channel.findByIdAndUpdate(channel._id, {
      $push: { messages: savedMessage._id }
    });
  
    await User.findByIdAndUpdate(fromUser.userId, {
      $push: { messages: savedMessage._id }
    });

    socket.emit("privateMessage", {from: fromUser.username, text: savedMessage.text, createdAt: savedMessage.createdAt, to: toUser, private: savedMessage.private});
  } catch (error) {
    console.error('Error creating private message:', error);
    socket.emit("errorSocket", error.message);
  }
}