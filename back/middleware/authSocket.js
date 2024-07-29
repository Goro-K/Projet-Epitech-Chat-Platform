import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN;

// Middleware d'authentification pour Socket.IO
const socketAuth = async (socket, next) => {
  const token = socket.handshake.auth.token; // Ou socket.handshake.query.token, selon votre implémentation côté client
  if (!token) {
    const err = new Error("You must be logged in");
    err.data = { content: "Please send a token" }; // Informations supplémentaires
    return next(err);
  }

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      const err = new Error("You must be logged in");
      err.data = { content: "Token is invalid" };
      return next(err);
    }
    socket.user = decoded; // Stockez les données décodées dans l'objet socket pour une utilisation ultérieure
    next();
  });
};

export default socketAuth;
