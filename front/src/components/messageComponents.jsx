import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString(undefined, options);
}
  
function MessageComponent({ socket, channel, user}) {
    const [messages, setMessages] = useState([]);
    console.log("Messages", messages);

    useEffect(() => {
        if (!socket) return;
        socket.on("messageCreated", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        
        socket.on("AlerteChannel", (notification) => {
            setMessages((prevNotifications) => [...prevNotifications, notification]);
        });

        // si userId de useAuthContext est == toUser ou fromUser alors on stocke le message dans le state 
        socket.on("privateMessage", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        socket.on("listResponse", (list) => {
            console.log(list);
        }
        );
        return () => {
            socket?.off("messageCreated");
            socket?.off("AlerteChannel");
            socket?.off("privateMessage");
          };
      }, [socket, channel, user, setMessages]);

    
    useEffect(() => {
    const fetchMessages = async () => {
        try {
        if (!channel) return;
        const response = await fetch(`http://localhost:3000/api/channels/${channel?._id}/messages`, {
            headers: {
                Authorization: `Bearer ${user?.token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data);
        } catch (error) {
        console.error('Error fetching messages:', error);
        }
    };
    
    fetchMessages();
    }, [channel, user]); 

    return (
        <>
            {
            messages.map((msg, index) => {
                // Vérifier si le message est un message privé (contient `from` et `to`)
                const isPrivateMessage = msg.private === true;

                // Déterminer si l'utilisateur actuel est l'expéditeur ou le destinataire du message privé
                const isCurrentUserSender = msg.from === user.username;
                const isCurrentUserRecipient = msg.to === user.username;

                // Condition pour afficher le message privé envoyé
                if (isPrivateMessage && isCurrentUserSender) {
                    return (
                    <li key={index} className='message_block'>
                      <div className='message_informations_block'>
                        <p className='messages_sender'>Message privé à {msg.to}</p>
                        <p className='message_informations'>{formatDate(msg.createdAt)}</p> 
                      </div>
                      <p className='message_bubble'>{msg.text}</p>
                    </li>
                    );
                }

                // Condition pour afficher le message privé reçu
                if (isPrivateMessage && isCurrentUserRecipient) {
                    return (
                    <li key={index} className='message_block'>
                      <div className='message_informations_block'>
                        <p className='message_sender'>Message privé de {msg.from}</p>
                        <p className='message_informations'>{formatDate(msg.createdAt)}</p>
                      </div>
                      <p className='message_bubble'>{msg.text}</p>
                    </li>
                    );
                }

                // Condition pour les messages normaux dans le channel
                if (!isPrivateMessage) {
                    return (
                    <li key={index} className='message_block'>
                      <div className='message_informations_block'>
                        <p className="message_sender">{`${msg.from}`}</p>
                        <p className='message_informations'>{`${formatDate(msg.createdAt)}`}</p>
                      </div>
                      <p className='message_bubble'>{msg.text}</p>
                    </li>
                    );
                }
            }
        )}
        </>
    )
}

MessageComponent.propTypes = {
    socket: PropTypes.object,
    channel: PropTypes.object,
    user: PropTypes.object.isRequired
}

export default MessageComponent;