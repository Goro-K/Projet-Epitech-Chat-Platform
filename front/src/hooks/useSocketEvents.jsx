// hooks/useSocketEvents.js
import { useEffect } from 'react';
import { UseAuthContext } from '../hooks/useAuthContext';

export const useSocketEvents = (socket, setError) => {
  const { dispatch } = UseAuthContext();

  // Mettre à jour le nom d'utilisateur dans le contexte global
  useEffect(() => {
    if (socket) {
      const onNameUpdated = (username) => {
        console.log('nameUpdated:', username);
        // Mettre à jour le nom d'utilisateur dans le contexte global
        dispatch({ type: 'CHANGE_USERNAME', payload: username });
      };

      const onErrorSocket = (error) => {
        // Définir une erreur localement dans le composant qui utilise ce hook
        setError(error);
      };

      // Abonnement aux événements de socket
      socket.on("nameUpdated", onNameUpdated);
      socket.on("errorSocket", onErrorSocket);

      // Nettoyage lors du démontage du composant ou si le socket change
      return () => {
        socket.off("nameUpdated", onNameUpdated);
        socket.off("errorSocket", onErrorSocket);
      };
    }
  }, [socket, dispatch, setError]);
};
