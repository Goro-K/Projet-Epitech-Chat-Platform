// userController.js
import Channel from '../../models/Channels.js';
import User from '../../models/Users.js';

export async function setUsername (socket, data) {

  //vérifier si le pseudo est déjà pris
  const userExist = await User.findOne({
    username: data.username
  });
  
  if (userExist) {
    socket.emit("errorSocket", "Ce pseudo est déjà pris");
    return;
  }

  // Vérifier si le pseudonyme est vide
  if (!data.username) {
    socket.emit("errorSocket", "Le pseudonyme ne peut pas être vide");
    return;
  }
  
  // Récupérer l'ID de l'utilisateur
  const userId = socket.user._id;

  try {
    await User.findByIdAndUpdate(userId, { username: data.username }, { new: true });

    // Mis à jour du pseudo de l'utilisateur dans la liste utilisateur du channel
    await Channel.updateMany(
      { "users.user": userId }, // Filtrer les documents où l'utilisateur apparaît
      { $set: { "users.$.username": data.username } } // Mettre à jour le username dans le tableau users
    );
    socket.emit("nameUpdated", data.username);
  } catch (error) {
    console.error('Error updating username:', error);
    socket.emit("errorSocket", "Ce pseudo est déjà pris" );
  }
}
