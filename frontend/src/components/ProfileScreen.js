import { useState } from 'react';
import { getData, putData, patchData } from '../utils/fetching';
import LoadingWidget from './LoadingWidget';

/**
  * Component for the user profile screen. Allows the user to edit their details and change 
  * their password.
  */
export default function ProfileScreen(props) {
    const [ tempUser, setTempUser ] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    
    /**
      * Validates the user profile form and sends an API call to update the user.
      *
      * @param {Event} event The form submit event to stop default behavior.
      */
    function sendUserUpdateToServer(event) {
        event.preventDefault();
        const userToSend = {
            firstName : document.getElementById("first-name-field").value,
            lastName : document.getElementById("last-name-field").value,
            email : document.getElementById("email-field").value,
            position : document.getElementById("position-field").value
        };

        putData(`/api/users/${tempUser._id}`, userToSend, (response) => {
            if (response.status != 200 ) {
                props.showToastMessage("Error", "User wasn't updated", "danger");
            } else {
                response.json().then( savedUser => {
                    props.setCurrentUser(savedUser);
                    props.showToastMessage("Success", "User profile updated", "success");
                });
            }
        });
    }

    /**
      * Validates the password change form and sends an API call to chang ethe password.
      *
      * @param {Event} event The form submit event to stop default behavior.
      */
    function requestPasswordChange(event) {
        event.preventDefault();
        const passwordElement1 = document.getElementById("new-password-field");
        const passwordElement2 = document.getElementById("new-password-confirm-field");

        if (passwordElement1.value !== passwordElement2.value) {
            passwordElement2.setCustomValidity("Passwords don't match");
            passwordElement2.reportValidity();
        } else {
            const objectToSend = {
                oldPassword: document.getElementById('old-password-field').value,
                newPassword: document.getElementById('new-password-field').value,
            }

            patchData(`/api/users/password-change`, objectToSend, (response) => {
                if ( response.status != 200 ) {
                    props.showToastMessage("Error", "Password was not changed", "danger");
                } else {
                    props.showToastMessage("Success", "Password changed successfully", "success");
                }
            });
        }
    }
    /**
      * Custom validation function for the password form that ensures that new password and the 
      * confirmation field have the same value.
      */
    function resetPasswordValidation() {
        const passwordElement1 = document.getElementById("new-password-field");
        const passwordElement2 = document.getElementById("new-password-confirm-field");

        passwordElement1.setCustomValidity("");
        passwordElement2.setCustomValidity("");
    }
    
    //Load the user profile to change.

    if (!loaded && !loading) {
        getData('/api/users/self', setTempUser, setLoading, setLoaded, (response => {
                switch (response.status) {
                    case 401:
                    case 404:
                        props.showToastMessage("Verify identity", "Please log in again");
                        props.logout();
                        break;
                    default:
                        props.showToastMessage("Verify identity", "Please log in again",'warning');
                }
            })
        );
    }
    
    if ( !loaded ) {
        return <LoadingWidget />;
    } else  {
        return ( 
            <div>
                <h1>User profile - {tempUser.firstName} {tempUser.lastName}</h1>
                <hr className="blue-divider" />
                <form onSubmit={sendUserUpdateToServer}>
                    <h2>Edit your profile:</h2>
                    <div className="form-row">
                        <label htmlFor="first-name-field">First name(s):</label>
                        <input type="text" defaultValue={tempUser.firstName} id="first-name-field" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="last-name-field">last name:</label>
                        <input type="text" defaultValue={tempUser.lastName} id="last-name-field" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="email-field">Email:</label>
                        <input type="text" defaultValue={tempUser.email} id="email-field" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="position-field">Job title:</label>
                        <input type="text" defaultValue={tempUser.position} id="position-field" />
                    </div>
                    <div className="form-row">
                        <input type="submit" value="Confirm" id="user-edit-submit" />
                    </div>
                </form>
                    <hr className="blue-divider" />
                <form onSubmit={requestPasswordChange}>
                    <h2>Change your password:</h2>
                    <div className="form-row">
                        <label htmlFor="old-password-field">Old password:</label>
                        <input type="password" id="old-password-field" placeholder="Old password" required/>
                    </div>
                    <div className="form-row">
                        <label htmlFor="new-password-field">New password:</label>
                        <input type="password"
                            id="new-password-field"
                            placeholder="New password"
                            onChange={resetPasswordValidation}
                            minLength={8}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <label htmlFor="new-password-confirm-field">Confirm new password:</label>
                        <input type="password"
                            id="new-password-confirm-field"
                            placeholder="Confirm new password"
                            onChange={resetPasswordValidation}
                            minLength={8}
                            required

                        />
                    </div>
                    <div className="form-row">
                        <input type="submit" value="Change" id="password-change-submit" />
                    </div>
                </form>

            </div>
        );
    }
}

