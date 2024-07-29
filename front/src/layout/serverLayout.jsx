import { Outlet, NavLink, useParams } from "react-router-dom"
import {UseAuthContext} from '../hooks/useAuthContext';
import ChannelComponent from "../components/channelComponents";
import { useServerContext } from "../hooks/useServerContext";
import UserComponents from "../components/userComponents";
import { useEffect, useState } from "react";

function ServerLayout() {
    const {user} = UseAuthContext();
    const {servers} = useServerContext();
    const {serverName} = useParams()
    const [channels, setChannels] = useState([]);
    const [showUsers, setShowUsers] = useState(false);

    const serverData = servers?.find(server => server.serverName === serverName)
    console.log(serverData)
    const serverId = serverData?._id;
    
    useEffect(() => {
      const fetchChannels = async () => {
        try {
          if (serverId && user) {
            const response = await fetch(`http://localhost:3000/api/servers/${serverId}/channels`,
            {
              headers: {
                Authorization: `Bearer ${user?.token}`
              }
            });
            if (!response.ok) {
              throw new Error('Problème lors de la récupération des canaux');
            }
            const data = await response.json();
            setChannels(data);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des canaux:', error);
        }
      };
  
      fetchChannels();
    }, [serverId, user]); // Récupère à nouveau les canaux si l'ID du serveur change

    const deleteServer = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/servers/${serverId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        });
        if (!response.ok) {
          throw new Error('Problème lors de la suppression du serveur');
        }
        console.log('Server deleted');
      }
      catch (error) {
        console.error('Erreur lors de la suppression du serveur:', error);
      }
    }

    return (
      <>
        {user ? (
        <div className="server_page">
          <nav>
              <div className="channel">
                  <h3>{serverData?.serverName}</h3>
                  {serverData?.serverAdmin == user.userId ? 
                  <button onClick={deleteServer}>Supprimer le serveur ?</button> : null}
                  {channels && channels.map((channel) => (
                    <NavLink to={`channel/${channel.name}`} key={channel._id}>
                      <ChannelComponent channelName={channel.name} /> 
                    </NavLink>
                  ))}
              </div>
          </nav>
          <section className="chat">
            <Outlet context={[channels, serverData, setShowUsers]}/> 
          </section>
          <section className="bloc_users"> {/* Si active apparait */}
            <UserComponents showUsers={showUsers} channels={channels} />
          </section>
        </div>
        ) : (
          null
        )}
      </>
    )   
}

export default ServerLayout;