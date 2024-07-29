import Channel from '../../models/Channels.js';
import User from '../../models/Users.js';
import Server from '../../models/Servers.js';
import Message from '../../models/Messages.js';

export async function createChannel (socket, data) {
  const server = data.server;
  const user = data.user;
  const channelName = data.channelName;
  
  // Vérifier si le channel n'existe pas dans le serveur
  const channelExist = await Channel.findOne({
    name: channelName,
    server: server._id
  });

  if (channelExist) {
    socket.emit("errorSocket", "Ce nom de canal est déjà pris");
    return;
  } else {
    const newChannel = new Channel({
      name: channelName,
      server: server._id, 
      users: [
        {
          user: user.userId, 
          username: user.username,
          roles: ['admin'] // Le créateur est automatiquement admin
        }
      ], 
      messages: [],
    });

    // Ajoute le canal à la liste des canaux du serveur
    await Server.findByIdAndUpdate(
      server._id,
      { $addToSet: { channels: newChannel._id } },
      { new: true }
    );

    // Ajoute le canal à la liste des canaux de l'utilisateur
    await User.findByIdAndUpdate(
      user.userId,
      { $addToSet: { adminChannels: newChannel._id, channels: newChannel._id } },
      { new: true }
    );


    try {
      await newChannel.save();
      socket.emit("channelCreated", channelName);
    } catch (error) {
      console.error('Error creating channel:', error);
      socket.emit("errorSocket", error.message);
    }
  }
}

export async function renameChannel (socket, data) {

  const channelName = data.channelName;
  const channel = data.channel;
  const server = data.server;

  const channelExist = await Channel.findOne({
    name: channelName,
    server: server._id
  });
  
  if(!channel) {
    socket.emit("errorSocket", "Veuillez rentrer dans un canal pour le renommer");
    return;
  }

  if (channelExist) {
    socket.emit("errorSocket", "Le canal existe déjà");
    return;
  }

  // Vérifier si le nom est vide
  if (!channelName) {
    socket.emit("errorSocket", "Le nom du canal ne peut pas être vide");
    return;
  }

  if(channel.name.toString() == "general") {
    socket.emit("errorSocket", "Vous ne pouvez pas renommer le canal général");
    return;
  }

  try {
    await Channel.findByIdAndUpdate(
      channel._id,
      { name: channelName },
      { new: true }
    );
    socket.emit("channelRenamed", channelName);
  } catch (error) {
    console.error('Error renaming channel:', error);
    socket.emit("errorSocket", error.message);
  }
}


export async function deleteChannel (socket, data) {

  const channelName = data.channelName;
  const channel = data.channel;
  const server = data.server;
  const user = data.user;

  const channelExist = await Channel.findOne({
    name: channelName,
    server: server._id
  });

  if (!channelExist) {
    socket.emit("errorSocket", "Ce nom de canal n'existe pas");
    return;
  }

  const userExist = await User.findById(user.userId);

  if (!userExist?.adminChannels.includes(channelExist._id)) {
    socket.emit("errorSocket", "Vous ne pouvez pas supprimer un canal dont vous n'êtes pas administrateur");
    return;
  }
  
  if(channelName == "general") {
    socket.emit("errorSocket", "Vous ne pouvez pas supprimer le canal général");
    return;
  }

  if(!channelName) {
    socket.emit("errorSocket", "Veuillez rentrer dans un canal pour le supprimer");
    return;
  }

  if (!channelExist) {
    socket.emit("errorSocket", "Ce nom de canal n'existe pas");
    return;
  } else {
    try {
      await Channel.findByIdAndDelete(channel._id);
      await Server.findByIdAndUpdate(
        server._id,
        { $pull: { channels: channel._id } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        userExist._id,
        { $pull: { channels: channel._id } },
        { new: true }
      );
      
      if (User?.adminChannels.includes(channel._id)) {
        await User.findByIdAndUpdate(
          userExist._id,
          { $pull: { adminChannels: channel._id } },
          { new: true }
        );
      }

      socket.emit("channelDeleted", channelName);
    } catch (error) {
      console.error('Error deleting channel:', error);
      socket.emit("errorSocket", error.message);
    }
  }
}

export async function joinChannel (socket, data) {

  const channelName = data.channelName;
  const server = data.server;
  const user = data.user;

  try {
    const channelExist = await Channel.findOne({
      name: channelName,
      server: server._id
    });

    console.log(channelExist)

    const userExist = await User.findById(user.userId);

    if (!channelExist) {
      socket.emit("errorSocket", "Ce channel n'existe pas");
      return;
    }

    // Vérifie si l'utilisateur est déjà dans le canal
    if (userExist?.channels.includes(channelExist._id)) {
      socket.emit("errorSocket", "Vous êtes déjà dans ce canal");
      return;
    }

    const newMessage = new Message({
      from: userExist._id,
      text: `${userExist.username} a rejoint le channel.`,
      channel: channelExist._id
    });

    const savedMessage = await newMessage.save();

    // Ajoute l'utilisateur au canal
    await Channel.findByIdAndUpdate(
      channelExist._id,
      { $addToSet: 
        { users: 
          { user: user.userId,
            username: user.username,
            roles: ['membre']
          } 
        } 
      },
      { new: true }
    );

    // Ajoute le canal à l'utilisateur
    await User.findByIdAndUpdate(
      user.userId,
      { $addToSet: { channels: channelExist._id } },
      { new: true }
    );

    socket.emit("AlerteChannel", {text: savedMessage.text, createdAt: savedMessage.createdAt});
  } catch (error) {
    console.error('Error joining channel:', error);
    socket.emit("errorSocket", error.message);
  }
}

export async function quitChannel(socket, data) {
  const channelName = data.channelName;
  const server = data.server;
  const user = data.user;

  try {
    const channelExist = await Channel.findOne({ 
      name: channelName,
      server: server._id
    });

    const userExist = await User.findById(user.userId);

    if (!channelExist) {
      socket.emit("errorSocket", "Ce channel n'existe pas");
      return;
    }

    if(userExist.adminChannels.includes(channelExist._id)) {
      socket.emit("errorSocket", "Vous ne pouvez pas quitter un canal dont vous êtes administrateur");
      return;
    }

    const newMessage = new Message({
      from: userExist._id,
      text: `${userExist.username} a quitté le channel.`,
      channel: channelExist._id
    });

    const savedMessage = await newMessage.save();

    // Retirez l'utilisateur de la liste des utilisateurs du canal
    await Channel.findByIdAndUpdate(
      channelExist._id,
      { $pull: { users: { user: user.userId } }},
      { new: true }
    );

    // Retirez le canal de la liste des canaux de l'utilisateur
    await User.findByIdAndUpdate(
      userExist._id,
      { $pull: { channels: channelExist._id } }, // Retirez l'ID du canal du tableau des canaux de l'utilisateur
      { new: true }
    );

    socket.emit("AlerteChannel", {text: savedMessage.text, createdAt: savedMessage.createdAt});
  } catch (error) {
    console.error('Error quitting channel:', error);
    socket.emit("errorSocket", error.message);
  }
}

export async function listChannels(socket, data) {
  const fromUser = data.user;
  const channel = data.channel;
  const server = data.server;

  try {
    const query = {server: server._id};
    if (data.channelSearch) {
        query.name = { $regex: data.channelSearch, $options: 'i' }; // Recherche insensible à la casse
    }
    const channels = await Channel.find(query).select('name -_id'); // Récupère uniquement le nom des canaux

    const newMessage = new Message({
      from: fromUser.userId,
      text: `Liste des canaux récupérée: ${channels.map(channel => channel.name).join(', ')}`,
      channel: channel._id
    });

    const savedMessage = await newMessage.save();
    console.log(newMessage)
    socket.emit("messageCreated", {from: fromUser.username, text: savedMessage.text, createdAt: savedMessage.createdAt, private: savedMessage.private, to: savedMessage.to});
} catch (error) {
    console.error('Error listing channels:', error);
    socket.emit("errorSocket", "Erreur lors de la récupération des canaux");
}
}