import "../styles/RegisterScreen.css";
import { postData } from '../utils/fetching';
import { useNavigate } from "react-router-dom";
const requiredPasswordLength = 8;

export default function RegisterScreen() {
    
    const navigate = useNavigate();

    function validateFormAndSubmit(event) {
        const firstNameField = document.getElementById("registration-firstname-field");
        const lastNameField = document.getElementById("registration-lastname-field");
        const positionField = document.getElementById("registration-title-field");
        const emailField = document.getElementById("registration-email-field");

        const passwordElement1 = document.getElementById("registration-password-field");
        const passwordElement2 = document.getElementById("registration-password-confirmation-field");
        event.preventDefault();

        if (passwordElement1.value !== passwordElement2.value) {
            passwordElement2.setCustomValidity("Passwords don't match");
            passwordElement2.reportValidity();
        } else {
            passwordElement2.setCustomValidity("");
            const objectToSend = {
                firstName : firstNameField.value,
                lastName : lastNameField.value,
                position : positionField.value,
                email : emailField.value,
                password : passwordElement1.value
            };

            sendRegisterRequestToServer(objectToSend);
        }

    }

    function resetPasswordErrorState() {
        const passwordElement2 = document.getElementById("registration-password-confirmation-field");
        passwordElement2.setCustomValidity("");
    }

    function sendRegisterRequestToServer(userToPost) {
        const url = '/api/users';
        postData(url, userToPost, handleRegisterResponse);
    }

    function handleRegisterResponse(response, postedObject) {
        if (response.status == 201) {
            //Save the token to session data. Then redirect to the home page.
            response.json()
                .then((data) => {
                    console.log(`Token to save ${data.token}`);
                    navigate('/');
                })
        } else {
            //Toast error message
        }
    }

    return (
        <div className="centre-container">
            <div id="registration-content-wrapper">
                <h1>Cool Tech Logo Placeholder</h1>
                <p className="info-text">
                    Note that your account will be created with no privileges.<br />Only once an 
                    administrator assigns your account to your respective department will you be
                    able to view and create records.
                </p>
                <form id="registration-form" onSubmit={validateFormAndSubmit}>
                    <div className="form-row">
                        <span className="registration-label-wrapper">
                            <label htmlFor="registration-firstname-field">First names:</label>
                        </span>
                        <input type="text"
                            id="registration-firstname-field"
                            className="registration-field"
                            placeholder="First name"
                            required 
                        />
                    </div>
                    <div className="form-row">
                        <span className="registration-label-wrapper">
                            <label htmlFor="registration-lastname-field">Last name:</label>
                        </span>
                        <input type="text"
                            id="registration-lastname-field"
                            className="registration-field"
                            placeholder="Last name"
                            required
                        />
                    </div>
                    <div className="form-row">
                        <span className="registration-label-wrapper">
                            <label htmlFor="registration-title-field">Job title:</label>
                        </span>
                        <input type="text"
                            id="registration-title-field"
                            className="registration-field"
                            placeholder="Job title"
                        />
                    </div>
                    <div className="form-row">
                        <span className="registration-label-wrapper">
                            <label htmlFor="registration-email-field">Email:</label>
                        </span>
                        <input type="email" 
                            id="registration-email-field"
                            className="registration-field"
                            placeholder="username@cool-tech.com"
                            required 
                        />
                    </div>
                    <div className="form-row">
                        <span className="registration-label-wrapper">
                            <label htmlFor="registration-password-field">Password:</label>
                        </span>
                        <input type="password"
                            id="registration-password-field"
                            className="registration-field"
                            minLength={requiredPasswordLength}
                            placeholder="Password"
                            required 
                        />
                    </div>
                    <div className="form-row">
                        <span className="registration-label-wrapper">
                            <label htmlFor="registration-password-confirmation-field">Password:</label>
                        </span>
                        <input type="password" 
                            id="registration-password-confirmation-field"
                            className="registration-field"
                            minLength={requiredPasswordLength}
                            onChange={resetPasswordErrorState}
                            placeholder="Password"
                            required 
                        />
                    </div>
                    <div className="form-row centre">
                        <input type="submit" id="registration-button" value="Register" />
                    </div>
                </form>
            </div>
        </div>
    );
}
