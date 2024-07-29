import { createContext, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types';
import { authReducer } from './AuthReducer'

export const AuthContext = createContext()


export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null
  })

  useEffect(() => {
    if (state.user) {
    localStorage.setItem('user', JSON.stringify(state.user))
    }
  }, [state.user])

  // vérifie si l'utilisateur est connecté au chargement de la page (évite les déconnexions lors du rechargement de la page)
  useEffect(() => { 
    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      dispatch({ type: 'LOGIN', payload: user }) 
    }
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )
}

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};