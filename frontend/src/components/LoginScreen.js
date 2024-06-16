import "../styles/LoginScreen.css";

export default function LoginScreen(props) {
    return (
        <div className="centre-container">
        <h1>Cool Tech Logo Placeholder</h1>
        <p>You are accessing sensitive information. Please log in to proceed.</p>
        <form id="login-form">
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
