import { Outlet, NavLink, Link } from "react-router-dom";
import { UseAuthContext } from "../hooks/useAuthContext";
import { useLogout } from '../hooks/useLogout';
import { useServerContext } from "../hooks/useServerContext";

// import Profil from "../page/profil";
import ServerComponent from "../components/serverComponent";
import { useEffect, useState } from "react";

function RootLayout() {
    const { logout } = useLogout()
    const { user } = UseAuthContext()
    const { dispatch } = useServerContext()
    const [servers, setServers] = useState(null)

    const handleClick = () => {
        logout()
    }

    useEffect(() => {
        if(!user) return;
            const fetchServers = async () => {
                try {
                    const response = await fetch('http://localhost:3000/api/servers', {
                        headers: {
                            Authorization: `Bearer ${user?.token}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Error when fetching servers')
                    }
                    const serversArray = await response.json()
                    setServers(serversArray)
                } catch (error) {
                    console.error(error)
                }
            }
            fetchServers()
        }
    , [user])

    useEffect(() => {
        if (servers) {
            dispatch({type: 'SET_SERVERS', payload: servers}); // Met à jour le contexte global avec les serveurs de l'état local.
        }
    }, [servers, dispatch]); // Ce useEffect dépend de l'état local `servers`.

    return (
        <div className="root_layout">
            <header>
                {/* //ajouter images + fond noir + quand clique sur image nous get du server fait apparaitre tous les chanels*/}
                {/* Btn creer un server */}
                <nav className="nav_bar servers">
                    {user ? (
                        <>
                            {servers && servers.map((server) => (
                                <NavLink to={`server/${server.serverName}`} key={server._id}>
                                    <ServerComponent server={server}/>
                                </NavLink>
                            ))}
                            <NavLink className="backgroundMoreBtn" to="form-server">
                                    <img className="moreBtn" src="/more.png" alt="Icon +"></img>
                            </NavLink> 
                            <NavLink to={`profil/${user.username}`} state={user} >
                                <button className="button">Profil</button>
                            </NavLink>
                            <button onClick={handleClick}>Log out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="button">Connexion</button>
                            </Link>
                            <Link to="/register">
                                <button className="button">Inscription</button>
                            </Link>
                        </>
                    )}
                </nav>
            </header>          
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default RootLayout;