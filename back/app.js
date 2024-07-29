import http from 'http'
import express, { json, urlencoded } from 'express';
import cors from 'cors'; // Import the cors package
import mongoose from 'mongoose'; // Import the mongoose package

// Include the routes
import channelsRoute from './api/routes/channelsRoute.js';
import messagesRoute from './api/routes/messagesRoute.js';
import usersRoute from './api/routes/usersRoute.js';
import serversRoute from './api/routes/serversRoute.js';


import dotenv from 'dotenv'; // Import the dotenv package
import path from 'path';
import { Server } from 'socket.io';

import { fileURLToPath } from 'url';
import socket from "./socket/sockets.js"
import socketAuth from "./middleware/authSocket.js"

dotenv.config(); // Configure dotenv

const MONGO_URL = process.env.MONGO_URL; // Get the URL from the .env file

// Connect to MongoDB

mongoose.connect(MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error(error.message));

// Create the express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Autoriser uniquement les requêtes de cette origine
  }
})
const port = 3000

// Middleware for parsing JSON and handling POST requests
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Middleware d'authentification pour Socket.IO
io.use(socketAuth); 

// Gestion des événements de connexion
io.on('connection', socket);


// Route of our API
app.use('/api/channels', channelsRoute);
app.use('/api/messages', messagesRoute);
app.use('/api/users', usersRoute);
app.use('/api/servers', serversRoute);
app.use('/uploads', express.static('images'));

const directoryName = path.dirname(fileURLToPath(import.meta.url)); // Get the directory name

app.use('/images', express.static(path.join(directoryName, 'images'))) // Make the images folder accessible

server.listen(
  port, 
  () => console.log(`Serveur démarré sur le port ${port}`)
);