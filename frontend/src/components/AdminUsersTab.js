import '../styles/AdminUsersTab.css';
import LoadingWidget from './LoadingWidget';
import { useState } from 'react';
import { getData, patchData, deleteResource } from "../utils/fetching";
import RepoAccessForm from './RepoAccessForm';
import TransparentOverlay from './TransparentOverlay';

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

    function deleteUserButtonPress(event) {
        deleteResource(`/api/users/${event.target.value}`, handleDeleteResponse);
    }

    function handleDeleteResponse(response) {
        if (response.status == 200) {
            response.json().then( data => {
                console.log("Deleted user:");
                console.log(data);
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

    function increaseAccessLevel(event) {
        const user = getUserFromID(event.target.value);
        const newRole = user.role === 'manager' ? 'admin' : 'manager';

        const objectToSend = { role: newRole};
        patchData(`/api/users/${user._id}`, objectToSend, handleRoleChangeResponse);
    }


    function decreaseAccessLevel(event) {
        const user = getUserFromID(event.target.value);
        const newRole = user.role === 'manager' ? 'user' : 'manager';

        const objectToSend = { role: newRole};
        patchData(`/api/users/${user._id}`, objectToSend, handleRoleChangeResponse);
    }

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
            //Toast the error message.
        }
    }

    function hideOverlay() {
        setOverlayVisible(false);
        setSelectedUserIndex(-1);
    }

    function openRepoAccessOverlay(event) {
        const index = event.target.value;

        setSelectedUserIndex(index);
        setOverlayVisible(true);
    }

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

    function handleFailedResponse (response) {
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
    };

 
    // Load data from the server if necessary
    
    if (!loaded && !loading && !errorState) {
        setLoading(true);
        console.log("loading data");
        let usersLoaded = false;
        let orgsLoaded = false;
        
        function handleUserSuccess (data) {
            setUsers(data);
            usersLoaded = true;
        }

        function handleOrgSuccess(data) {
            setOrgs(data);
            orgsLoaded = true;
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
        
        if (usersLoaded && orgsLoaded) {
            setLoaded(true);
            setLoading(false);
        }
    }
    
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

    console.log(`Error state: ${errorState}`);
    console.log(`Loading: ${loading}`);
    console.log(`Loaded: ${loaded}`);

    
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


