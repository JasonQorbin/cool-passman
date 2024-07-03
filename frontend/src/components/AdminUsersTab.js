import '../styles/AdminUsersTab.css';
import LoadingWidget from './LoadingWidget';
import { useState } from 'react';
import { getData, patchData, deleteResource } from "../utils/fetching";
import RepoAccessForm from './RepoAccessForm';
import TransparentOverlay from './TransparentOverlay';

/**
 * Component for the User tab on the admin panel.
 */
export default function AdminUsersTab(props) {
    const [users, setUsers] = useState([]);
    const [orgs, setOrgs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [selectedUserIndex, setSelectedUserIndex] = useState(-1);
    const [errorState, setErrorState] = useState(false);
    const [ overlayVisible, setOverlayVisible ] = useState(false);
    const [ overlayMode, setOverlayMode ] = useState("");
    
    
    /**
      * Helper function that searches for the user that matches the given id string and returns that user object. 
      *
      * @param {string} id - The id string of the user being searched for.
      * @returns {Object} - The user from the users array.
      */
    function getUserFromID(id) {
        for (const user of users) {
            if (user._id === id) {
                return user;
            }
        }
    }

    /**
     * Callback function for the button to delete a user. Triggers an API call.
     *
     * @param event The button click event. Used to find the specific user account referred to.
     */
    function deleteUserButtonPress(event) {
        deleteResource(`/api/users/${event.target.value}`, handleDeleteResponse);
    }
    
    /**
     * Handles the response from the server after deleting a user. Updates the local cache to reflect the change
     * to avoid having to fetch the full user list again.
     *
     * @param response The response from the server
     */
    function handleDeleteResponse(response) {
        if (response.status == 200) {
            response.json().then( data => {
                let positionToDelete = -1;
                for (let i = 0; i < users.length; i++) {
                    if (users[i]._id == data._id) {
                        positionToDelete = i;
                        break;
                    }
                }
                if (positionToDelete === -1) {
                    setLoaded(false);
                } else {
                    const newUsers = Array.from(users);
                    newUsers.splice(positionToDelete,1);
                    setUsers(newUsers);
                }
            });
        }
    }
    
    /**
     * Callback function for the button to increase a user's access level.
     *
     * @param event The button click event. Used to find the specific user account referred to.
     */
    function increaseAccessLevel(event) {
        const user = getUserFromID(event.target.value);
        const newRole = user.role === 'manager' ? 'admin' : 'manager';

        const objectToSend = { role: newRole};
        patchData(`/api/users/${user._id}`, objectToSend, handleRoleChangeResponse);
    }

    /**
     * Callback function for the button to decrease a user's access level.
     *
     * @param event The button click event. Used to find the specific user account referred to.
     */
    function decreaseAccessLevel(event) {
        const user = getUserFromID(event.target.value);
        const newRole = user.role === 'manager' ? 'user' : 'manager';

        const objectToSend = { role: newRole};
        patchData(`/api/users/${user._id}`, objectToSend, handleRoleChangeResponse);
    }
    
    /**
     * Handles the response from the server after modifying a user's role.
     *
     * @param response The response from the server
     */
    function handleRoleChangeResponse(response) {
        if (response.status === 200) {
            response.json().then( data => {
                const newUsers = Array.from(users);
                for (const user of newUsers) {
                    if (user._id === data._id) {
                        user.role = data.role;
                        break;
                    }
                }
                setUsers(newUsers);
            });
        } else {
            switch (response.status) {
                case 401:
                    //Force a logout.
                    props.showToastMessage("Verify identity","Please log in again");
                    props.logout();
                    break;
                case 403:
                    props.showToastMessage("Access denied", "You don't have the correct privileges to perform this action", "danger");
                    break;
                default:
                    props.showToastMessage("Server error", "An error occurred on the server.", "warning");
            }
        }
    }
    
    /**
     * Hides the transparent overlay form.
     */
    function hideOverlay() {
        setOverlayVisible(false);
        setSelectedUserIndex(-1);
    }
    
    /**
     * Displays the transparent overlay form for adding/removing access to repos for a selected user.
     *
     * @param {*} event The click event to find the table entry that was selected.
     */
    function openRepoAccessOverlay(event) {
        const index = event.target.value;

        setSelectedUserIndex(index);
        setOverlayVisible(true);
    }
    
    /**
      * After a successful change to a user on the server, this function updates the local cached user values to match
      * so that the application doesn't need to hit the server with another download again.
      *
      * @param The user object that was updated on the server.
      */
    function updateUser(newUser) {
        const newUserArray = users.map(item => {
            if (item._id === newUser._id) {
                return newUser;
            } else {
                return item;
            }
        });
        setUsers(newUserArray);
    }

    /**
      * Handles the situations where the loading of data from the server fails due by displaying an appropriate message
      * and forcing a logout if needed.
      *
      * @param response The response from the server. Used to check the response code.
      */
    function handleFailedResponse (response) {
        setErrorState(true);
        setLoading(false);
        switch (response.status) {
            case 401:
                //Force a logout.
                props.showToastMessage("Verify identity","Please log in again");
                props.logout();
                break;
            case 403:
                props.showToastMessage("Access denied", "You don't have the correct privileges to perform this action", "danger");
                break;
            default:
                props.showToastMessage("Server error", "An error occurred on the server.", "warning");
        }
    };

 
    // Load data from the server if necessary
    
    if (!loaded && !loading && !errorState) {
        setLoading(true);
        console.log("loading data");
        let usersLoaded = false;
        
        function handleUserSuccess (data) {
            setUsers(data);
            usersLoaded = true;
            console.log("Users loaded");
        }

        function handleOrgSuccess(data) {
            setOrgs(data);
            if (usersLoaded) {
                setLoaded(true);
                setLoading(false);
            }
            console.log("Orgs loaded");
        }

        getData('/api/users',  handleUserSuccess, null, null, (response) => {
            console.log("Handling bad response");
            setErrorState(true);
            setLoading(false);
            switch (response.status) {
                case 401:
                    //Force a logout.
                    props.showToastMessage("Verify identity","Please log in again");
                    props.logout();
                    break;
                case 403:
                    props.showToastMessage("Access denied", "You don't have the correct privileges to perform this action", "danger");
                    break;
                default:
                    props.showToastMessage("Server error", "An error occurred on the server.", "warning");
            }
            console.log(`Errorstate: ${errorState}`);
                
        });

        getData('/api/org', handleOrgSuccess, null, null, handleFailedResponse);
    }
    
    //Popluate the overlay form if required.
    let overlay;
    if ( !overlayVisible ) {
        overlay = <div></div>;
    } else {
        overlay = (
        <TransparentOverlay>
            <RepoAccessForm
                orgs={orgs}
                closeOverlay={hideOverlay}
                selectedUser={users[selectedUserIndex]}
                updateUser={updateUser}
            />
        </TransparentOverlay>
        );
    }

    //Create the table row elements that contain the user records.

    const tableRows = users.map( (user, index) => {
        const accessButtons = [];
        if (user.role !== "admin") {
            accessButtons.push(
                <td key={user._id + "_inc"} className="button-column">
                    <button onClick={increaseAccessLevel} value={user._id}>Inc Access level</button>
                </td>);
        } else {
            accessButtons.push(<td key={user._id + "_inc"} className="button-column"></td>);
        }
        if (user.role !== "user") {
            accessButtons.push(
                <td key={user._id + "_dec"} className="button-column">
                    <button onClick={decreaseAccessLevel} value={user._id}>Dec Access level</button>
                </td>);
        } else {
            accessButtons.push(<td key={user._id + "_dec"} className="button-column"></td>);
        }


        return (
                    <tr key={user._id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td className="title-column">{user.position}</td>
                        <td className="role-column">{user.role}</td>
                        {accessButtons}
                        <td className="button-column"><button value={index} onClick={openRepoAccessOverlay}>Department access</button></td>
                        <td className="button-column"><button value={user._id} onClick={deleteUserButtonPress}>Delete User</button></td>
                    </tr>
        )
    }) 

    if (!loaded) {
        return <LoadingWidget />;
    } else if (errorState == true) {
        return <div></div>;
    } else {
        return (
            <div>
                {overlay}
                <table id="admin-users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Title</th>
                            <th colSpan="3">Access Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
            </div>
        );
    }
}


