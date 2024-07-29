import { UseAuthContext } from './useAuthContext'

export const useLogout = () => {
  const { dispatch } = UseAuthContext()

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user')
    localStorage.removeItem('isLogging')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })
  }

  return { logout }
}