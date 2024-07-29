import { createContext, useReducer } from 'react'
import PropTypes from 'prop-types';
import { ServerReducer } from './ServerReducer'
export const ServerContext = createContext() 

export const ServerContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(ServerReducer, { 
        servers: []
    })
    

    // vérifie si un serveur existe dans la database 

    return (
        <ServerContext.Provider value={{ ...state, dispatch }}>
        { children }
        </ServerContext.Provider>
    )
}

ServerContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};