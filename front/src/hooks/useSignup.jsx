import { useState } from 'react'
import { UseAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = UseAuthContext()

  const signup = async (username, email, password, password_confirm) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('http://localhost:3000/api/users/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, email, password, password_confirm })
    })
    const json = await response.json()
    console.log(json)
    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify({userId: json._id, token: json.token}))

      // update the auth context
      dispatch({type: 'LOGIN', payload: JSON.stringify({username: json.username, email: json.email, userId: json._id, token: json.token})})

      // update loading state
      setIsLoading(false)
      
    }
  }

  return { signup, isLoading, error }
}