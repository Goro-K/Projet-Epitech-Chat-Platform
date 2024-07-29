import { useState } from 'react';
import { UseAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

const useCreateServer = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {user} = UseAuthContext();
    const navigate = useNavigate();

    const createServer = async (image, serverName) => {
        setIsLoading(true)
        setError(null)

        const formData = new FormData();
        formData.append('serverName', serverName);
        formData.append('serverAdmin', user.userId);
        formData.append('image', image);
        formData.append('channels', 'general');
        const response = await fetch('http://localhost:3000/api/servers', {
            method: 'POST',
            body: formData,
            headers: {
            Authorization: `Bearer ${user.token}`
            }
        });
        const data = await response.json();

        if (!response.ok) {
            setIsLoading(false)
            setError(data.message)
        }

        if (response.ok) {
            setIsLoading(false)
            navigate(`/server/${serverName}`)
        }
    }
    return { createServer, isLoading, error }
};

export default useCreateServer;