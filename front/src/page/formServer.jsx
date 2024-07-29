import { useState } from 'react';
import useCreateServer from '../hooks/useCreateServer';

function FormServer() {
  const [serverName, setServerName] = useState('');
  const [image, setImage] = useState(null);
  const {createServer, error, isLoading} = useCreateServer();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createServer(image, serverName);
  }

  return (
    <div>
      <h1>FormServer</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          <span>Server Name</span>
          <input
            type="text"
            placeholder="Server Name"
            onChange={(e) => setServerName(e.target.value)} value={serverName}
          />
        </label>

        <label>
          <span>Image</span>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <button type="submit" className="button" disabled={isLoading}>
          Submit
        </button >
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

export default FormServer;