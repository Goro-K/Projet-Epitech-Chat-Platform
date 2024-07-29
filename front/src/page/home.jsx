import { UseAuthContext } from '../hooks/useAuthContext';

const home = () => {
    const {user} = UseAuthContext()

    return (
        <div className="home">
            <h1>Bienvenue sur votre page d&apos;accueil {user?.username} !</h1>
        </div>
    );
};

export default home;