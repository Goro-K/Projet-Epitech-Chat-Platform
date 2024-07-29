import Sad from "/triste.png"
import { useNavigate } from "react-router-dom";

import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

function SignUp() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password_confirm, setPasswordConfirm] = useState('')
    const {signup, error, isLoading} = useSignup()
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
    
        await signup(username, email, password, password_confirm)
        navigate('/server')
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
                    <h3>Inscription</h3>
                    <label>
                    <span>Pseudo</span>
                    <input type="text" placeholder="Pseudo" onChange={(e) => setUsername(e.target.value)} value={username}></input>
                    </label>
                    <label>
                    <span>Email</span>
                    <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                    </label>
                    <label>
                    <span>Password</span>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                    </label>
                    <label>
                    <span>Confirm password</span>
                    <input type="password" onChange={(e) => setPasswordConfirm(e.target.value)} value={password_confirm} />
                    </label>
                    <button className="button" disabled={isLoading}>Sign up</button>
                    {error && <div className="error">{error}</div>}
                </form>
            </div>
        </div>
    )
}

export default SignUp;