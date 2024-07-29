import { useState} from "react";
import { UseAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

function Profil() {
    const [showLayout, setShowLayout] = useState(false);
    const {user} = UseAuthContext();
    const {logout} = useLogout();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleClickPassword = () => { setShowLayout(true); };

    const handleSubmitDeleteAccount = async (e) => {
        e.preventDefault();
        try {
            await fetch(`http://localhost:3000/api/users/${user.userId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${user?.token}`
            }
            });
            logout();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la suppression du compte");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Vérification de la validité des mots de passe
        if (newPassword !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/users/${user.userId}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ newPassword })
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du mot de passe');
            }
            alert('Mot de passe mis à jour avec succès');
            // Réinitialiser les champs du formulaire
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la mise à jour du mot de passe');
        }
        setShowLayout(false);
    };

    return (
        user ? (
            <div className="block_profil">
                <h1>Profil</h1>
                    <p>Username : {user.username}</p>
                    <p>Email : {user.email}</p>
                {showLayout ? (
                    <form onSubmit={handleSubmit}>
                        <input type="password" placeholder="Nouveau mot de passe" value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input type="password" placeholder="Confirmer le mot de passe" value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button type="submit">Changer le mot de passe</button>
                    </form>
                ) : (
                    <button onClick={handleClickPassword} className="button_in_profil">Modifier le mot de passe</button>
                )}
                <button onClick={handleSubmitDeleteAccount} className="button_in_profil delete_account">Supprimer le compte</button>
            </div>
        ) : (
            null
        )
    )
}
export default Profil;