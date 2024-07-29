import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { handleSocketCommand } from '../hooks/handleSocketCommand';
import { useOutletContext, useParams } from 'react-router-dom';
import { UseAuthContext } from '../hooks/useAuthContext';
import MessageComponents from '../components/messageComponents';
import { useSocketEvents } from '../hooks/useSocketEvents';

const Channel = () => {
  const [channelData, serverData, setShowUsers] = useOutletContext();
  const {channelName} = useParams();
  const channel = channelData.find(channel => channel.name === channelName);
  const {user} = UseAuthContext();
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialiser la connexion socket ici
    const newSocket = io("http://localhost:3000", {
      auth: {
        token: user?.token, // Assurez-vous que user et user.token sont disponibles
      },
    });
    setSocket(newSocket);

    return () => {
      newSocket.close(); // Fermer la connexion socket lors du démontage du composant
    };
  }, [user]); // Ce useEffect se déclenchera uniquement lorsque user change

  useSocketEvents(socket, setError);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message === "/users") {
      setShowUsers(true);
    } else if (socket) {
      // Pour les autres messages, continuez comme avant
      handleSocketCommand(socket, message, channel, user, serverData);
    }
    setMessage('');
  };

  return (
    <>
      <ul className="messages_list">
          <MessageComponents socket={socket} channel={channel} user={user} />
      </ul>
      <form onSubmit={handleSubmit} className="chat_container">
        <input className="chat_input" type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Place your message here"/>
        <button className='send_button' type="submit">Send</button>
      </form>
      {error && <p>{error}</p>}
    </>
  )
}
export default Channel;