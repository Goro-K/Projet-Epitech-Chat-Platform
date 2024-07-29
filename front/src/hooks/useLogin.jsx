import { useState } from 'react'
import { UseAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = UseAuthContext()
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    })

    const user = await response.json()
  
    if (!response.ok) {
      setIsLoading(false)
      setError(user.message)
    }

    if (response.ok) {
       // save the user to local storage
      localStorage.setItem('user', JSON.stringify({userId: user.userId, token: user.token, username: user.username}))
      localStorage.setItem('isLogging', true)

       // update the auth context
      dispatch({type: 'LOGIN', payload: user})
      // update loading state
      setIsLoading(false)
      navigate('/server')
    }
  }

  console.log(error)
  return { login, isLoading, error }
}