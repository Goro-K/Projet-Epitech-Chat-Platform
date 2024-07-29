import Sad from "/triste.png"
import { useState } from "react"
import { useLogin } from "../hooks/useLogin"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, error, isLoading} = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()
    
        await login(email, password)
    }

    return (
        <div className="auth_page">
            <div className="empty_layout">
                <h2>Not Connected</h2>
                <div className="sad_container">
                    <img src={Sad} alt="sad" className="sad_icon"></img>
                </div>
            </div>
            <div className="auth">
                <form onSubmit={handleSubmit}>
                    <h3>Connexion</h3>
                    <label>
                    <span>Email</span>
                    <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                    </label>
                    <label>
                    <span>Mot de passe</span>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                    </label>
                    <button className="button" disabled={isLoading}>Log in</button>
                    {error && <div className="error">{error}</div>}
                </form>
            </div>
        </div>
    )
}

export default Login;