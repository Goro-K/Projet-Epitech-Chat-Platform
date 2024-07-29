import PropsTypes from 'prop-types';
import { useParams } from 'react-router-dom';
function UserComponents({showUsers, channels}) {
    const {channelName} = useParams();
    const currentChannel = channels.find(channel => channel.name === channelName);
    return (
        <div>
        {currentChannel ? (
            <>
              <h3>{currentChannel.name}</h3>
              {showUsers ?

                <ul className='user_list'>
                  {currentChannel.users.map((userObj, index) => (
                    <li key={index} className='user'>
                      <span className='role'>{userObj.roles.join(', ').toUpperCase()}</span> 
                      <br />
                      <span className='username'>{userObj.username}</span>
                    </li>
                  ))}
                </ul>
                : <p>/users pour voir tout les utilisateurs</p>
              }

            </>
          ) : (
            <p>Canal non trouvé</p>
          )}
        </div>
    )
}

UserComponents.propTypes = {
    channels: PropsTypes.array.isRequired,
    showUsers: PropsTypes.bool.isRequired
}

export default UserComponents;