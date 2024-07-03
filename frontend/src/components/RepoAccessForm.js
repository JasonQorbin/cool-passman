import { useState } from 'react';
import { patchData } from '../utils/fetching';

/**
  * Form displayed in an overlay window that allows admin to change the access privileges of
  * other users.
  */
export default function RepoAccessForm(props) {
    const [ deptChoices, setDeptChoices ] = useState([]);

    const orgOptions = [];
    
    orgOptions.push(<option value="">---</option>);
    for (const org of props.orgs) {
        orgOptions.push(<option key={org._id} value={org._id}>{org.name}</option>);
    }
    
    /**
      * Updates the options in the drop-down menu for departments when the select of the OU drop-down
      * menu changes.
      */
    function updateDepartmentChoices() {
        const newList = [];
        newList.push(<option value="">---</option>);
        
        const orgSelectValue = document.getElementById("org-selector").value;
        if (orgSelectValue === ""){
            return;
        }

        let org;
        for (const item of props.orgs) {
            if (item._id === orgSelectValue) {
                org = item;
                break;
            }
        }

        for (const dept of org.departments) {
            if (!userAuthorisedOnDept(props.selectedUser, org._id, dept._id)) {
                newList.push(<option key={dept._id} value={dept._id}>{dept.name}</option>)
            }
        }
        setDeptChoices(newList);
    }
    
    /**
      * Reads through the authorised repos list of the given user to to find out if they has access
      * privileges on the given department and OU.
      *
      * @param {object} user The user to check
      * @param {string} orgID The id number of the OU.
      * @param {string} deptID The id number of the department
      *
      * @returns true if the user has access.
      */
    function userAuthorisedOnDept(user, orgID, deptID) {
        let answer = false;

        for (const item of user.authorised_repos) {
            if ( item.orgID === orgID && item.deptID === deptID ) {
                answer = true;
                break;
            }
        }
        return answer;
    }

    /**
      * Callback for the Add button. Triggers an api call to add access to the selected department for the current user.
      *
      * Also updates the local cached data on success.
      */
    function addDepartmentAccess() {
        const selectedOrg = document.getElementById('org-selector').value;
        const selectedDept = document.getElementById('dept-selector').value;
        if (selectedOrg === "" || selectedDept === "") {
            return;
        }

        const url = `/api/users/${props.selectedUser._id}/add_dept`;
        const body = { orgID: selectedOrg, deptID: selectedDept};
        patchData(url, body, (response) => {
            if (response.status === 200) {
                const newUser = Object.assign({}, props.selectedUser);
                newUser.authorised_repos.push(body);
                document.getElementById('org-selector').value = "";
                document.getElementById('dept-selector').value = "";
                props.updateUser(newUser);
            }
        });
    }

    let existingAuthorisations;
    
    if (props.selectedUser.authorised_repos.length === 0) {
        existingAuthorisations = <div></div>;
    } else {

        const tableRows = props.selectedUser.authorised_repos.map((item, index) => {
            let org;
            let dept;
            for (const currentOrg of props.orgs) {
                if (currentOrg._id === item.orgID) {
                    org = currentOrg;
                    for (const currentDept of org.departments) {
                        if( currentDept._id === item.deptID) {
                            dept = currentDept;
                            break;
                        }
                    }
                    break;
                }
            }

            /**
            * Callback for the Remove button. Triggers an api call to remove access from the selected department for the current user.
            *
            * Also updates the local cached data on success.
            */
            function removeAccess() {
                const url = `/api/users/${props.selectedUser._id}/remove_dept`;
                const body = { orgID : org._id, deptID : dept._id};
                patchData(url, body, (response) => {
                    if (response.status === 200) {
                        const modifiedUser = Object.assign({},props.selectedUser);
                        let position = -1;
                        for (let i = 0; i < modifiedUser.length; ++i) {
                            if (modifiedUser.authorised_repos[i].orgID === org._id && 
                                modifiedUser.authorised_repos[i].deptID === dept._id) {
                                position = i;
                                break;
                            }
                        }
                        modifiedUser.authorised_repos.splice(position,1);
                        props.updateUser(modifiedUser);
                    }
                });
            }

            return (
                <tr key={index}>
                        <td>{org.name}</td>
                        <td>{dept.name}</td>
                        <td><button onClick={removeAccess}>Remove Access</button></td>
                </tr>
            );
        });
        
        existingAuthorisations = (
            <table>
                <thead>
                    <tr>
                        <th>Org Unit</th>
                        <th>Department</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        )
    }


    return (
        <div>
            <h1>Add/Remove departmental access privileges:</h1>
            <hr />
            <label htmlFor="org-selector">Organisational Unit:</label>
            <select id="org-selector" onChange={updateDepartmentChoices}>
                {orgOptions}
            </select>
            <label htmlFor="dept-selector">Organisational Unit:</label>
            <select id="dept-selector">
                {deptChoices}
            </select>
            <button onClick={addDepartmentAccess}>Add</button>
            <hr />
            <h2>Current access:</h2>
            {existingAuthorisations}
            <hr />
            <button onClick={props.closeOverlay}>Close</button>
        </div>
    )
}
