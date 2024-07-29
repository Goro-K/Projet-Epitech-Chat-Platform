import { ServerContext } from "../context/ServerContext"
import { useContext } from "react"

export const useServerContext = () => {
  const context = useContext(ServerContext)

  if(!context) {
    throw Error('useServerContext must be used inside an ServerContextProvider')
  }

  return context
}