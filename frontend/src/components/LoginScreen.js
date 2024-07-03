import "../styles/LoginScreen.css";
import { getData, postData } from '../utils/fetching';
import { sessionTokenKey } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen(props) {
    const navigate = useNavigate();
    
    /**
      * Handles the submit event on the login form. Trigger the appropriate API call to authenticate the
      * credentials provided.
      *
      * @param {Event} event Submit event from the login form. Used to stop the default submit behaviour. 
      */
    function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById("login-email-field").value;
        const password = document.getElementById("login-password-field").value;

        const loginObject = { email : email, password : password};

        postData('/api/login', loginObject, handleLoginResponse);
    }
    
    /**
      * Handles the response from the server to the login request. On success it saves the Auth 
      * token in session storage. It then fetches the authenticated user profile from the
      * server using the token and caches it in the application state.
      *
      * On failure, it displays a toast message saying what's wrong.
      *
      * @param {object} response The response object from the server.
      * @param {object} objectSent The object that was initially sent.
      */
    function handleLoginResponse(response, objectSent) {

        if (response.status === 200) {
            response.json().then( body => {
                sessionStorage.setItem(sessionTokenKey, body.token);

                //After getting and caching the token, fetch the current user in order to display their name on the
                //main page header.
                getData('/api/users/self', (data) => {
                    props.setCurrentUser(data);
                    navigate('/');
                }); //Todo: Handled errors on this GET operation.
                
            });
        } else {
            switch (response.status) {
                case 401:
                    props.showToastMessage("Login failed", "Please check your username and password", 'warning');
                    break;
                default:
                    props.showToastMessage("Login failed", "Server error", 'warning');
                    break;
            }
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
