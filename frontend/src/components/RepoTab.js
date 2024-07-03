import { useState } from 'react';
import { deleteResource, postData, putData } from '../utils/fetching';
import TransparentOverlay from './TransparentOverlay';
import CredentialInputForm from './CredentialInputForm';

/**
 * Component that represents a tab that display the credentials of a single
 * department's repository. Serves as the content on one tab in the "My Repositories" screen.
 */
export default function RepoTab(props) {
    
    const [ selectedIdx, setSelectedIdx ] = useState(-1);
    const [ overlayVisible, setOverlayVisible ] = useState(false);
    const [ overlayMode, setOverlayMode ] = useState("");
    
    /**
      * Callback for the Add Item button. Displays the input form in 'add' mode.
      */
    function getNewCredentialInput(){
        setOverlayMode("add");
        setOverlayVisible(true);
    }

    /**
      * Callback for the Edit Item button. Displays the input form in 'edit' mode.
      */
    function getCredentialEdit(){
        setOverlayMode("edit");
        setOverlayVisible(true);
    }


    /**
      * Hides the input dialog.
      */
    function hideOverlay() {
        setOverlayVisible(false);
        setOverlayMode("");
    }

    /**
      * Triggers an API call to create a new credential on the server.
      *
      * @param {object} credential Contains the fields of a credential record. 
      */
    function createCredentialOnServer( credential ) {
        postData(`/api/repo/${props.repoObject.orgID}/${props.repoObject.deptID}`, credential, (response) => {
            if (response.status === 200) {
                response.json().then( newCredential => {
                    props.addCredential(props.repoObject.orgID, props.repoObject.deptID, newCredential);
                });
            } else {
                props.showToastMessage("Error", "Couldn't create new credential", 'warning');
            }
        });
        hideOverlay();
    }

    /**
      * Triggers an API call to edit a credential on the server.
      *
      * @param {object} credential Contains the fields of a credential record. 
      */
    function changeCredentialOnServer( credential ) {
        const credentialID = props.repoObject.repo[selectedIdx]._id;
        putData(`/api/repo/${props.repoObject.orgID}/${props.repoObject.deptID}/${credentialID}`, credential, (response) => {
            if (response.status === 200) {
                response.json().then( newCredential => {
                    props.updateCachedCredential(props.repoObject.orgID, props.repoObject.deptID, credentialID, newCredential);
                });
            } else {
                props.showToastMessage("Error", `Couldn't modify credential on the server`, 'warning');
            }
        });
        hideOverlay();
    }

    /**
      * Triggers an API call to delete a credential on the server.
      */
    function deteleSelectedCredentialOnServer () {
        const credentialID = props.repoObject.repo[selectedIdx]._id;

        deleteResource(`/api/repo/${props.repoObject.orgID}/${props.repoObject.deptID}/${credentialID}`, (response) => {
            if (response.status === 200) {
                props.deleteCachedCredential(props.repoObject.orgID, props.repoObject.deptID, selectedIdx);
            } else {
                props.showToastMessage("Error", `Couldn't modify credential on the server`, 'warning');
            }
        });

    }



   const repoTableRows = props.repoObject.repo.map( 
        (credential, index) => {
           return ( 
                <tr key={index}
                    onClick={()=> setSelectedIdx(index)}
                    className={selectedIdx == index ? "selected" : ""}>
                    <td>{credential.name}</td>
                    <td>{credential.url}</td>
                    <td>{credential.username}</td>
                    <td>{credential.password}</td>
                </tr>
            );
        }
    )
    
    const repoEditButtons = [];
    repoEditButtons.push( <button key="add" onClick={getNewCredentialInput}>Add Item</button> );
    
    //Todo: Restrict these buttons to only Managers and Admins
    if (selectedIdx > -1 && props.currentUser.role != 'user') {
        repoEditButtons.push( <button key="edit" onClick={getCredentialEdit}>Edit Item</button> );
        repoEditButtons.push( <button key="delete" onClick={deteleSelectedCredentialOnServer}>Delete Item</button> );
    }
 
    let overlay;  

    if ( !overlayVisible ) {
        overlay = <div></div>;
    } else {
        switch(overlayMode) {
            case "edit":
                overlay = (
                 <TransparentOverlay>
                    <CredentialInputForm
                        cancelCallback={hideOverlay}
                        submitCallback={changeCredentialOnServer}
                        credential={props.repoObject.repo[selectedIdx]}
                    />
                 </TransparentOverlay>
                );
                break;
            default:
                overlay = (
                 <TransparentOverlay>
                    <CredentialInputForm
                        cancelCallback={hideOverlay}
                        submitCallback={createCredentialOnServer}
                        credential={null}
                    />
                 </TransparentOverlay>
                );
                break;
                
        }
    }

    return (
        <div>
            {overlay}
            <div>
                {repoEditButtons}
            </div>
            <table className="repo-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>URL</th>
                        <th>Username</th>
                        <th>Password</th>
                    </tr>
                </thead>
                <tbody>
                    {repoTableRows}
                </tbody>
            </table>
        </div>
    );
}
