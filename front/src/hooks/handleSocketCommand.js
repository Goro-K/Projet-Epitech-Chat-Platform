export const handleSocketCommand = (socket, message, channel, fromUser, server) => {

    // Regex qui récupère les mots commencant par "/"
    const match = message.match(/^\/(\w+)\s*(.*)/)

    if (match) {
    // déstructuration d'array, on récupère seulement la commad "/nick"
    // et le paramètre "toto" pour la "/nick toto"
    const [, command, param] = match;

    switch(command.toLowerCase()) {
        case "nick" :
            socket.emit("/nick", {username : param.trim(), channel : channel});
            break;
        case "list" :
            socket.emit("/list", {channelSearch:param.trim(), server: server, user: fromUser, channel: channel});
            break;
        case "create" :
            socket.emit("/create", { channelName: param.trim(), server : server, user: fromUser});
            break;
        case "delete" :
            socket.emit("/delete", { channelName: param.trim(), server : server, channel: channel, user: fromUser});
            break;
        case "join" :
            socket.emit("/join", { channelName: param.trim(), server : server, user: fromUser});
            break;
        case "quit" :
            socket.emit("/quit", { channelName: param.trim(), server : server, user: fromUser});
            break;
        case "users" :
            break;
        case "rename" :
            socket.emit("/rename", {channelName : param.trim(), channel: channel, server: server});
            break;
        case "msg" :{
            const [toUser, ...messageParts] = param.split(' ');
            const privateMessage = messageParts.join(' ');
            socket.emit("/msg", { fromUser: fromUser, toUser: toUser, message: privateMessage, channel: channel});
            break;
        }
        default:
            console.log(`Commande Inconnue: /${command}`);
    }
    } else {
        socket.emit("message", { channel, message, fromUser, server });
    }
}