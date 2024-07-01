import '../styles/AdminOrgsTab.css';
import { getData, postData, patchData, deleteResource } from '../utils/fetching';
import LoadingWidget from './LoadingWidget';
import SimpleItemTable from './SimpleItemTable';
import TransparentTextInputOverlay from './TransparentTextInputOverlay';
import { useState } from 'react';

function AdminOrgUnitsPanel(props) {
    const [orgs, setOrgs] = useState([]);
    const [loadingOrgs, setLoadingOrgs] = useState(false);
    const [loadedOrgs, setLoadedOrgs] = useState(false);

    const [authorisedUsers, setAuthorisedUsers] = useState([]);

    const [errorState, setErrorState] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [selectedDept, setSelectedDept] = useState(null);

    const [overLayDisplayed, setOverlayDisplay] = useState(false);

    function invalidateCachedData() {
        setLoadedOrgs(false);
        setAuthorisedUsers([]);
        setSelectedDept(null);
    }

    function getSelectedOrg(){
        if (orgs.length == 0) {
            return null;
        }
        for (const org of orgs){
            if (org._id == selectedOrg){
                return org;
            }
        }
    }

    function getSelectedDept(){
        if ( !selectedOrg || !selectedDept ) return null;
        
        const org = getSelectedOrg();
        for (const dept of org.departments) {
            if (dept._id == selectedDept) return dept;
        }
    }
    
    function selectNewOrg(newOrg) {
        setSelectedOrg(newOrg);
    }

    function selectNewDept(newDept) {
        setSelectedDept(newDept);
        getData(`/api/users/list-users/${selectedOrg}/${newDept}`, setAuthorisedUsers, null, null,(response) =>{
            switch (response.status) {
                case 401:
                    //Token may be bad. Make the user log in again
                    break;
                case 403:
                    props.showToastMessage("Error", "You don't have the correct privileges to perform this action", "danger");
                    break;
                default:
                    console.log(`Code received: ${response.status}`);
                    console.log(response);
                    props.showToastMessage("Error", "An error occured on the server", "warning");
                    break;
            }
        });
    }
    
    /**
      * Updates state to stop the transparent input layer from dislaying, effectively cancelling whatever 
      * operation/workflow you were busy with.
      */
    function cancelOverlay() {
        setOverlayDisplay(null);
    }
    
    /**
      * Callback function for the "Add OU" button.
      * Displays the input layer for the user to provide the name of the new OU.
      */
    function addOrgUnitButtonPress() {
        setOverlayDisplay({
            title: "New OU Name:",
            defaultValue : "",
            callback : postNewOU,
            cancelCallback : cancelOverlay
        })
    }
    
    /**
      * Triggers a POST request to the server to create a new OU.
      */
    function postNewOU(newName) {
        setOverlayDisplay(null);
        const objectToPost = { name : newName };
        postData('/api/org', objectToPost, handleAddOrgResult);
    }
    
    /**
      * Handles the server's response to a request to create a new OU
      */
    function handleAddOrgResult(response) {
        if (response.status == 201) {
            invalidateCachedData();
        } else {
            props.showToastMessage("Error", "Failed to create new Org Unit");
        }
        
    }
    
    
    /* Callback function for the "Rename OU" button.
     * Displays the input layer for the user to provide the new name OU.
     */
    function renameOrgUnitButtonPress() {
        setOverlayDisplay({
            title: "Rename OU:",
            defaultValue : getSelectedOrg().name,
            callback : patchOrgName,
            cancelCallback : cancelOverlay
        })
    }

    /**
      * Triggers a PATCH request to the server to rename the selected OU.
      */
    function patchOrgName(newName) {
        if (getSelectedOrg.name !== newName) {
            setOverlayDisplay(null);
            const objectToSend = { name : newName };
            patchData(`/api/org/${selectedOrg}`, objectToSend, handleRenameOrgResult);
        }
    }

    /**
      * Handles the server's response to a request to rename the selected OU.
      */
    function handleRenameOrgResult(response) {
        switch (response.status) {
            case 200:
                invalidateCachedData();
            
            case 500:
                //Toast server error
                console.log("Server error");
                break;

            case 404:
                //Record not found on the server. Refresh the local cache
                //Toast refesh.
                invalidateCachedData();
                break;

            case 500:
                //Toast server error
                console.log("Server error");
                break;
        }

    }
    
    /**
      * Triggers a DELETE request to the server to delete the selected OU.
      */
    function deleteSelectedOU() {
        const url = `/api/org/${selectedOrg}`;
        deleteResource(url, handleDeleteOrgResult);
    }

    /**
      * Handles the server's response to a request to delete the selected OU.
      */
    function handleDeleteOrgResult(response) {
        if (response.status == 200) {
            //Toast success message
            invalidateCachedData();
        } else {
            //Toast failure.
            //Someone else probably deleted the OU before this user so refresh the list
            invalidateCachedData();
        }
    }

    /**
      * Callback function for the "Add Dept" button.
      * Displays the input layer for the user to provide the name of the new department.
      */
    function addDeptButtonPress() {
        setOverlayDisplay({
            title: "New department name:",
            defaultValue : "",
            callback : postNewDept,
            cancelCallback : cancelOverlay
        })
    }
    
    /**
      * Triggers a POST request to the server to create a new department.
      */
    function postNewDept(newName) {
        setOverlayDisplay(null);
        const objectToPost = { name : newName };
        postData(`/api/org/${selectedOrg}`, objectToPost, handleAddDeptResult);
    }
    
    /**
      * Handles the server's response to a request to create a new department
      */
    function handleAddDeptResult(response) {
        if (response.status == 201) {
            invalidateCachedData();
        } else {
            //Toast showing error message
        }
        
    }
    
    
    /* Callback function for the "Rename Dept" button.
     * Displays the input layer for the user to provide the new department name.
     */
    function renameDeptButtonPress() {
        setOverlayDisplay({
            title: "Rename OU:",
            defaultValue : getSelectedDept().name,
            callback : patchDeptName,
            cancelCallback : cancelOverlay
        })
    }

    /**
      * Triggers a PATCH request to the server to rename the selected OU.
      */
    function patchDeptName(newName) {
        if (getSelectedDept.name !== newName) {
            setOverlayDisplay(null);
            const objectToSend = { name : newName };
            patchData(`/api/org/${selectedOrg}/${selectedDept}`, objectToSend, handleRenameDeptResult);
        }
    }

    /**
      * Handles the server's response to a request to rename the selected OU.
      */
    function handleRenameDeptResult(response) {
        switch (response.status) {
            case 200:
                invalidateCachedData();
                break;
            
            case 500:
                //Toast server error
                console.log("Server error");
                break;

            case 404:
                //Record not found on the server. Refresh the local cache
                //Toast refesh.
                invalidateCachedData();
                break;

            case 500:
                //Toast server error
                console.log("Server error");
                break;
        }

    }
    
    /**
      * Triggers a DELETE request to the server to delete the selected OU.
      */
    function deleteSelectedDept() {
        const url = `/api/org/${selectedOrg}/${selectedDept}`;
        deleteResource(url, handleDeleteDeptResult);
    }

    /**
      * Handles the server's response to a request to delete the selected OU.
      */
    function handleDeleteDeptResult(response) {
        if (response.status == 200) {
            //Toast success message
            invalidateCachedData();
        } else {
            //Toast failure.
            //Someone else probably deleted the OU before this user so refresh the list
            invalidateCachedData()
        }
    }
    
    // Load OU data from the server if it hasn't been already.
    if (!loadedOrgs && !loadingOrgs) {
        getData('/api/org', setOrgs, setLoadingOrgs, setLoadedOrgs, (response) => {
            switch (response.status) {
                case 401:
                    //Token may be bad. Make the user log in again
                    console.log("Got a 401");
                    break;
                case 403:
                    console.log("Got a 403");
                    props.showToastMessage("Error", "You don't have the correct privileges to perform this action", "danger");
                    break;
                default:
                    console.log("Got some other error");
                    props.showToastMessage("Error", "An error occured on the server", "warning");
                    break;
            }

        });
    }

    //Create the transparent input overlay if needed.

    const overlay = [];
    if (overLayDisplayed) {
        overlay.push(<TransparentTextInputOverlay key="overlay"
            title={overLayDisplayed.title}
            defaultValue={overLayDisplayed.defaultValue}
            submitCallback = {overLayDisplayed.callback}
            closeCallback = {cancelOverlay}
        />)
    }
    
    //Populate the buttons above the Org Unit table.

    const orgUnitButtons = [];
    if (loadedOrgs && !errorState) {
        orgUnitButtons.push(<button key="add-ou-button" onClick={addOrgUnitButtonPress}>Add OU</button>);
        if (selectedOrg) {
            orgUnitButtons.push(<button key="rename-ou-button" onClick={renameOrgUnitButtonPress}>Rename OU</button>);
            orgUnitButtons.push(<button key="delete-ou-button" onClick={deleteSelectedOU}>Delete OU</button>);
        }
    }
    
    //Populate the buttons above the Department table

    const deptButtons = [];
    if (loadedOrgs && selectedOrg) {
        deptButtons.push(<button key="add-dept-button" onClick={addDeptButtonPress}>Add Dept</button>);
        if (selectedDept) {
            deptButtons.push(<button key="rename-dept-button" onClick={renameDeptButtonPress}>Rename Dept</button>);
            deptButtons.push(<button key="delete-dept-button" onClick={deleteSelectedDept}>Delete Dept</button>);
        }
    }

    //Progressively display the tables as the user clicks through and the elements get loaded from the server.

    const tableGroups = [];
    if (loadingOrgs || loadedOrgs) {
        if(loadingOrgs) {
            tableGroups.push(<LoadingWidget key="orgs" />);
        } else {
            tableGroups.push(
                <div className="table-group" key="orgs">
                    {orgUnitButtons}
                    <SimpleItemTable title="Organisational Units" items={orgs} setSelectedCb={selectNewOrg} selected={selectedOrg} />
                </div>
            );
        }
    }

    if ( loadedOrgs && selectedOrg ) {
        tableGroups.push(
            <div className="table-group" key="depts">
                {deptButtons}
                <SimpleItemTable 
                    title="Departments"
                    items={getSelectedOrg().departments}
                    setSelectedCb={selectNewDept}
                    selected={selectedDept}
                />
            </div>
        );
    }
    
    let authorisedUsersTable = <div></div>;
    if ( authorisedUsers.length > 0 ) {
        const authorisedUserRows = authorisedUsers.map( user => {
            return (
                <tr>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.position}</td>
                    <td>{user.role}</td>
                </tr>
            )
        }); 
        authorisedUsersTable = (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Position</th>
                        <th>Level</th>
                    </tr>
                </thead>
                <tbody>
                    {authorisedUserRows}
                </tbody>
            </table>
        )
    }

    if (errorState) {
        return <div>Error: {errorMsg}</div>;
    } else {
        return (
            <div id="admin-org-unit-tab">
                <div>
                    {overlay}
                    {tableGroups}
                </div>
                <div>
                    {authorisedUsersTable}
                </div>
            </div>
        );
    }
}

export default AdminOrgUnitsPanel;
