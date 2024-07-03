import '../styles/RepoScreen.css';
import LoadingWidget from "./LoadingWidget";
import CredentialInputForm from './CredentialInputForm';
import { deleteResource, getData, postData, putData } from "../utils/fetching";
import { useState } from "react";
import TransparentOverlay from './TransparentOverlay';

export default function RepoScreen(props) {
    const [repoObjects, setRepoObjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    
    
    function addCredential(orgID, deptID, newCredential) {
        const newRepos = repoObjects.map( currentObject => {
            if (currentObject.orgID == orgID && currentObject.deptID == deptID) {
                currentObject.repo.push(newCredential);
            }
            return currentObject;
        });

        setRepoObjects(newRepos);
    }
    
    
    function updateCredential( orgID, deptID, index, newCredential ) {
        const newRepos = repoObjects.map( currentObject => {
            if (currentObject.orgID == orgID && currentObject.deptID == deptID) {
                currentObject.repo[index] = newCredential;
            }
            return currentObject;
        });

        setRepoObjects(newRepos);
    }

    function deleteCredential( orgID, deptID, index ) {
        const newRepos = repoObjects.map( currentObject => {
            if (currentObject.orgID == orgID && currentObject.deptID == deptID) {
                currentObject.repo.splice(index, 1);
            }
            return currentObject;
        });

        setRepoObjects(newRepos);
    }

    function changeTab(event) {
        setActiveTabIndex(event.target.value);
    }

    if (!loaded && !loading) {
        getData('/api/repo', setRepoObjects, setLoading, setLoaded, (response) => {
                if (response.status == 401 || response.status == 403) {
                   props.showToastMessage("Access denied", 
                    "You don't the correct access privileges for that recseource. Please log in again",'warning');
                    props.logout();
                } else {
                   props.showToastMessage("Data error", "Error while fetching repository data",'warning');
                }
            }
        );
    }
    
    if (!loaded) {
        return <LoadingWidget />
    } else {
        const repoTabButtons = repoObjects.map( (currentObject, index) => {
            return <button key={index} value={index} onClick={changeTab}>{currentObject.orgName} | {currentObject.deptName}</button>
        });
        if (repoObjects.length >0 ) {
            return (
                <div>
                    <div>
                        {repoTabButtons}
                    </div>
                    <RepoTab
                        repoObject={repoObjects[activeTabIndex]}
                        addCredential={addCredential}
                        showToastMessage={props.showToastMessage}
                        updateCachedCredential={updateCredential}
                        deleteCachedCredential={deleteCredential}
                        currentUser={props.currentUser}
                    />
                </div>
            );
        } else {
            <div>No content</div>
        }
    }
}

function RepoTab(props) {
    
    const [ selectedIdx, setSelectedIdx ] = useState(-1);
    const [ overlayVisible, setOverlayVisible ] = useState(false);
    const [ overlayMode, setOverlayMode ] = useState("");
    

    function getNewCredentialInput(){
        setOverlayMode("add");
        setOverlayVisible(true);
    }

    function getCredentialEdit(){
        setOverlayMode("edit");
        setOverlayVisible(true);
    }

    function hideOverlay() {
        setOverlayVisible(false);
        setOverlayMode("");
    }

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
