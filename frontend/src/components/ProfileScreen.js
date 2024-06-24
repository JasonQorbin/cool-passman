import { useState } from 'react';
import { getData } from '../utils/fetching';
import LoadingWidget from './LoadingWidget';

export default function ProfileScreen(props) {
    const [ tempUser, setTempUser ] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [errorState, setErrorState] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    
    if (!loaded && !loading) {
        getData('/api/users/random', setTempUser, setLoading, setLoaded, setErrorMsg, setErrorState)
            .catch( () => console.log("Error while fetching user data"));
    }
    
    if ( !loaded ) {
        return <LoadingWidget />;
    } else  {
        return ( 
            <div>
                <h1>User profile - {tempUser.firstName} {tempUser.lastName}</h1>
                <hr className="blue-divider" />
                <form>
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
                    <hr />
                <form>
                    <h2>Change your password:</h2>
                    <div className="form-row">
                        <label htmlFor="old-password-field">Old password:</label>
                        <input type="text" id="old-password-field" placeholder="Old password"/>
                    </div>
                    <div className="form-row">
                        <label htmlFor="new-password-field">New password:</label>
                        <input type="text" id="new-password-field" placeholder="New password"/>
                    </div>
                    <div className="form-row">
                        <label htmlFor="new-password-confirm-field">Confirm new password:</label>
                        <input type="text" id="new-password-confirm-field" placeholder="Confirm new password"/>
                    </div>
                    <div className="form-row">
                        <input type="submit" value="Change" id="password-change-submit" />
                    </div>
                </form>

            </div>
        );
    }
}

