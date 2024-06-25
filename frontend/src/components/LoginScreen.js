import "../styles/LoginScreen.css";
import { postData } from '../utils/fetching';
import { sessionTokenKey } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
    const navigate = useNavigate();

    function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById("login-email-field").value;
        const password = document.getElementById("login-password-field").value;

        const loginObject = { email : email, password : password};

        postData('/api/login', loginObject, handleLoginResponse);
    }

    function handleLoginResponse(response, objectSent) {
        if (response.status == 200) {
            response.json().then( body => {
                sessionStorage.setItem(sessionTokenKey, body.token);
                navigate('/');
            });
        } else {
            //Toast error message
            console.log("Login error");
        }

    }

    return (
        <div className="centre-container">
        <h1>Cool Tech Logo Placeholder</h1>
        <p>You are accessing sensitive information. Please log in to proceed.</p>
        <form id="login-form" onSubmit={handleLogin}>
            <div className="form-row">
                <span className="login-label-wrapper"><label htmlFor="login-email-field">Email:</label></span>
                <input type="email" id="login-email-field" className="login-field" placeholder="username@cool-tech.com" required />
            </div>
            <div className="form-row">
                <span className="login-label-wrapper"><label htmlFor="login-password-field">Password:</label></span>
                <input type="password" id="login-password-field" className="login-field" required />
            </div>
            <div className="form-row centre">
                <input type="submit" id="login-button" value="Log in" />
            </div>
        </form>
            <div className="centre">
                <a href="#">Register</a>
                <span className="vertical-spacer">|</span>
                <a href="#">Forgot my password</a>
            </div>
        </div>
    );
}
