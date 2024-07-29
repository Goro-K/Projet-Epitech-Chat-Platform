import Server from '../../models/Servers.js';
import Channel from '../../models/Channels.js';
import User from '../../models/Users.js';

export async function displayServers (req, res) {
  try {
    const servers = await Server.find();
    res.status(200).json(servers);
  } catch (error) {
    res.status(404).json({ error });
  }
}

export async function createServer(req, res) {
  const serverBody = req.body;
  if (!serverBody) {
    return res.status(400).json({ message: "Missing server data." });
  }

  if (serverBody.serverName === '' || !req.file) {
    return res.status(400).json({ message: "Field is missing." });
  }

  let existingServer;

  existingServer = await Server.findOne({ serverName: serverBody.serverName});

  if(existingServer) {
    return res.status(400).json({message : 'Serveur déjà existant'})
  }

  try {
    // Création du serveur
    const server = new Server({
      serverAdmin: req.auth._id, 
      serverName: serverBody.serverName,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      channels: [],
      users: [req.auth._id]
    });

    const savedServer = await server.save();
    const user = await User.findById(req.auth._id);

    // Création du canal "general"
    const generalChannel = new Channel({
      name: 'general',
      server: savedServer._id, 
      users: [
        {
          user: req.auth._id,
          username: user.username,
          roles: ['admin'] 
        }
      ], 
      messages: [],
    });

    const savedChannel = await generalChannel.save();

    // Mise à jour du serveur avec l'ID du canal "general"
    savedServer.channels.push(savedChannel._id);
    await savedServer.save();

    await User.findByIdAndUpdate(req.auth._id, {
      $push: { adminServer: savedServer._id, adminChannels: savedChannel._id, channels: savedChannel._id, servers: savedServer._id, users: user._id}
    });

    res.status(201).json({ server: savedServer, channel: savedChannel });
  } catch (error) {
    console.error('Error creating server and general channel:', error);
    res.status(500).json({ message: `Error creating server: ${error.message}` });
  }
}

export async function deleteServers (req, res) {
  try {
    await Server.deleteMany();
    res.status(200).json({ message: "All servers have been deleted" });
  } catch (error) {
    res.status(500).json({ message: `Error Server : ${error} `});
  }
}

export async function deleteServer (req, res) {
  try {
    const { id } = req.params;
    await Server.findByIdAndDelete(id);
    await Channel.deleteMany({ server: id });
    await User.updateMany({}, { $pull: { servers: id, adminServer: id } });
    res.status(200).json({ message: `Server with id ${id} has been deleted` });
  } catch (error) {
    res.status(500).json({ message: `Error Server : ${error} `});
  }
}


export async function displayChannels (req, res) {
  try {
    const { id } = req.params;
    const channels = await Channel.find({ server: id }); // Assurez-vous que `server` est bien l'ID de référence dans votre modèle Channel
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des canaux', error: error.message });
  }
};