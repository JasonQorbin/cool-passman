import '../styles/RepoScreen.css';
import LoadingWidget from "./LoadingWidget";
import { deleteResource, getData, postData, putData } from "../utils/fetching";
import { useState } from "react";
import RepoTab from './RepoTab';

export default function RepoScreen(props) {
    const [repoObjects, setRepoObjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    
    /**
      * Adds a credential to the local cache of the credentials after it has been created on the server
      *
      * @param {string} orgID The id number of the organisation unit (OU)
      * @param {string} deptID The id number of the department 
      * @param {object} newCredential The credential object from the server.
      */
    function addCredential(orgID, deptID, newCredential) {
        const newRepos = repoObjects.map( currentObject => {
            if (currentObject.orgID == orgID && currentObject.deptID == deptID) {
                currentObject.repo.push(newCredential);
            }
            return currentObject;
        });

        setRepoObjects(newRepos);
    }
    
    /**
      * Updates a credential to the local cache of the credentials after it has been changed on the server.
      *
      * @param {string} orgID The id number of the organisation unit (OU)
      * @param {string} deptID The id number of the department 
      * @param {object} newCredential The credential object from the server.
      */
    function updateCredential( orgID, deptID, index, newCredential ) {
        const newRepos = repoObjects.map( currentObject => {
            if (currentObject.orgID == orgID && currentObject.deptID == deptID) {
                currentObject.repo[index] = newCredential;
            }
            return currentObject;
        });

        setRepoObjects(newRepos);
    }

    /**
      * Deletes a credential to the local cache of the credentials after it has been deleted on the server.
      *
      * @param {string} orgID The id number of the organisation unit (OU)
      * @param {string} deptID The id number of the department 
      * @param {object} newCredential The credential object from the server.
      */
    function deleteCredential( orgID, deptID, index ) {
        const newRepos = repoObjects.map( currentObject => {
            if (currentObject.orgID == orgID && currentObject.deptID == deptID) {
                currentObject.repo.splice(index, 1);
            }
            return currentObject;
        });

        setRepoObjects(newRepos);
    }
    
    /**
      * Callback function for the Tab buttons. Changes the active tab to the one clicked.
      *
      * @param {Event} event Click event to find the tab header that was clicked.
      */
    function changeTab(event) {
        setActiveTabIndex(event.target.value);
    }

    //Load repo data if needed.

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


