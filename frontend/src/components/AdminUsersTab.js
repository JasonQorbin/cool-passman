import '../styles/AdminUsersTab.css';
import LoadingWidget from './LoadingWidget';
import { useState } from 'react';
import { getData, patchData, deleteResource } from "../utils/fetching";

export default function AdminUsersTab(props) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [errorState, setErrorState] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    
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


    // Load data from the server if necessary
    
    if (!loaded && !loading) {
        getData('/api/users', setUsers, setLoading, setLoaded, setErrorMsg, setErrorState)
            .catch( () => console.log("Error while fetching user data"));
    }
    
    const tableRows = users.map( (user) => {
        const accessButtons = [];
        if (user.role !== "admin") {
            accessButtons.push(<td key={user._id + "_inc"} className="button-column"><button>Inc Access level</button></td>);
        } else {
            accessButtons.push(<td key={user._id + "_inc"} className="button-column"></td>);
        }
        if (user.role !== "user") {
            accessButtons.push(<td key={user._id + "_dec"} className="button-column"><button>Dec Access level</button></td>);
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
                        <td className="button-column"><button value={user._id} onClick={deleteUserButtonPress}>Delete User</button></td>
                    </tr>
        )
    }) 

    if (!loaded) {
        return <LoadingWidget />;
    } else {
        return (
            <div>
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


