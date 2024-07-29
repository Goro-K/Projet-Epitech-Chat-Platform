# Chat IRC
  
# Chat en temps réel avec Socket.IO

Ce projet est une application de chat en temps réel construite avec Node.js, Express.js et Socket.IO côté serveur, et React.js côté client. L'application permet aux utilisateurs de créer des serveurs, de rejoindre des canaux et de discuter en temps réel avec d'autres utilisateurs sur ces canaux.
  
  
  
## Fonctionnalités

-Création de serveurs et de canaux  
-Rejoindre des serveurs et canaux existants  
-Envoyer des messages en temps réel dans les canaux  
-Chaque utilisateur peut effectuer ces commandes:  
    - /nick nickname  
    - /list [string]  
    - /create channel  
    - /delete channel  
    - /join channel  
    - /quit channel  
    - /users  
    - /msg nickname message  
    - message  
  
  
  
## Technologies utilisées

Node.js  
Express.js  
Socket.IO  
React.js  
MongoDB  
  
  
  
## Installation

Cloner le dépôt Git :

```bash
git clone https://github.com/EpitechMscProPromo2026/T-JSF-600-LYO_8.git projet_chat_IRC
```
  
Accéder au répertoire du projet :

```bash
cd projet_chat_IRC
```
  
Installer les dépendances pour le serveur (dans le dossier /back) :

```bash
npm i
```
  
Installer les dépendances pour le client (dans le dossier /front) :

```bash
npm i
```
  
  
  
## Utilisation

Démarrer le serveur (à partir du dossier /back) :

```bash
nodemon app.js
```
  
Démarrer l'application cliente (à partir du dossier /front) :

```bash
npm run dev
```
  
Accéder à l'application dans votre navigateur à l'adresse http://localhost:5173.
  
  
  
## Auteurs

Lya Dalibard  
Roman Kiziltoprak