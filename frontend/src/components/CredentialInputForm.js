export default function CredentialInputForm(props) {
    let credential;

    if (props.credential == null) {
        credential = {
            name : "",
            url : "",
            username : "",
            password : ""
        }
    } else {
        credential = props.credential;
    }
    
    function submitAction(event) {
        event.preventDefault();
        credential.name = document.getElementById("credential-name-field").value;
        credential.url = document.getElementById("credential-url-field").value;
        credential.username = document.getElementById("credential-username-field").value;
        credential.password = document.getElementById("credential-password-field").value;

        props.submitCallback(credential);
    }

    return (
        <form onSubmit={submitAction}>
            <div className="form-row">
                <label  htmlFor="credential-name-field">Name:</label>
                <input id="credential-name-field" type="text" defaultValue={credential.name} required/>
            </div>
            <div className="form-row">
                <label  htmlFor="credential-url-field">URL:</label>
                <input id="credential-url-field" type="text" defaultValue={credential.url} />
            </div>
            <div className="form-row">
                <label  htmlFor="credential-username-field">Username:</label>
                <input id="credential-username-field" type="text" defaultValue={credential.username} />
            </div>
            <div className="form-row">
                <label  htmlFor="credential-password-field">Password:</label>
                <input id="credential-password-field" type="text" defaultValue={credential.password} />
            </div>
            <div className="form-row">
                <input type="submit" value="OK" />
                <button onClick={props.cancelCallback}>Cancel</button>
            </div>
        </form>
    );
}