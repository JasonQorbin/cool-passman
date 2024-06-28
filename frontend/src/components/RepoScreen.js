import '../styles/RepoScreen.css';
import LoadingWidget from "./LoadingWidget";
import CredentialInputForm from './CredentialInputForm';
import { getData, postData } from "../utils/fetching";
import { useState } from "react";
import TransparentOverlay from './TransparentOverlay';

export default function RepoScreen(props) {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    
    const [errorState, setErrorState] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    
    function addCredential(orgID, deptID, newCredential) {
        const newRepos = repos.map( repo => {
            if (repo.orgID == orgID && repo.deptID == deptID) {
                repo.repo.push(newCredential);
            }
            return repo;
        });

        setRepos(newRepos);
    }

    if (!loaded && !loading) {
        getData('/api/repo', setRepos, setLoading, setLoaded, setErrorMsg, setErrorState)
            .catch( () => {
                console.log("Error while fetching repository data");
                props.showToastMessage("Data error", "Error while fetching repository data",'warning');
            });
    }
    
    if (!loaded) {
        return <LoadingWidget />
    } else {
        if (repos.length >0 ) {
            return (
                <div>
                    <RepoTab
                        repo={repos[0]}
                        addCredential={addCredential}
                        showToastMessage={props.showToastMessage}
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
        postData(`/api/repo/${props.repo.orgID}/${props.repo.deptID}`, credential, (response) => {
            if (response.status == 200) {
                response.json().then( newCredential => {
                    console.log(newCredential);
                    props.addCredential(props.repo.orgID, props.repo.deptID, newCredential);
                });
            } else {
                props.showToastMessage("Error", "Couldn't create new credential", 'warning');
            }
        });
    }

    function changeCredentialOnServer( credential ) {
        console("Edit on server");
        console.log(credential);
        hideOverlay();
    }

    const repoTableRows = props.repo.repo.map( 
        (credential, index) => {
           return ( 
                <tr key={index} onClick={()=> setSelectedIdx(index)}>
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
    if (selectedIdx > -1) {
        repoEditButtons.push( <button key="edit">Edit Item</button> );
        repoEditButtons.push( <button key="delete">Delete Item</button> );
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
                        credential={props.repo.repo[selectedIdx]}
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
