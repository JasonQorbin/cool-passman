import '../styles/AdminPanel.css';
import { useState } from 'react';

function AdminPanel(){
    const [activePanel, setActivePanel] = useState("Org Units");
    
    function setPanelToOrgs() { setActivePanel("Org Units");}
    function setPanelToUsers() { setActivePanel("Users");}

    const chosenPanel = [];

    switch (activePanel) {
        case "Org Units":
            chosenPanel.push(<OrgUnitsPanel key="orgs"/>);
            break;
        case "Users":
            chosenPanel.push(<UsersPanel key="users" />);
            break;
        default:
            chosenPanel.push(<OrgUnitsPanel key="orgs" />);
    }

    return (
        <div>
            <button onClick={setPanelToOrgs}>Org Units</button>
            <button onClick={setPanelToUsers}>Users</button>
            {chosenPanel}            
        </div>
    );
}

function getData(url, setData, setLoading, setLoaded, setErrorMsg, setErrorState) {
    setLoading(true);
    return new Promise( (resolve, reject) => {
        fetch(url)
            .then( response => {
                if (response.status == 403) {
                    throw new Error ("Forbidden");

                }
                if (response.status == 404) {
                    throw new Error ("Not Found");
                }
                if (response.status == 200) {
                    return response.json();
                }
            })
            .then( 
                data => { 
                    setData(data);
                    setLoading(false);
                    setLoaded(true);
                    resolve(true);
                },
                error =>{ 
                    if (error.message === "JSON.parse: unexpected character at line 1 column 1 of the JSON data") {
                        setErrorMsg("JSON Parse error");
                    }
                    if (error.message === "Forbidden") {
                        setErrorMsg("You do not have the correct privileges to few this");
                    }
                    if (error.message === "Not Found") {
                        setErrorMsg("Not implemented yet...");
                    }
                    setErrorState(true);
                    reject(false);
                }
            );
    });
}

function OrgUnitsPanel() {
    const [orgs, setOrgs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [errorState, setErrorState] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedOrg, setSelectedOrg] = useState(null);

    if (!loaded && !loading) {
        getData('/api/org', setOrgs, setLoading, setLoaded, setErrorMsg, setErrorState)
            .catch( () => console.log("Error while fetching data"));
    }

    if (errorState) {
        return <div>Error: {errorMsg}</div>;
    } else if (loading) {
        return <LoadingWidget />;
    } else {
        return (
            <div>
                <OrgTable orgs={orgs} />
            </div>
        );
    }
}

function LoadingWidget() {
    return (
        <div>
            Loading...
        </div>
    )
}

function UsersPanel() {
    return <div>Users</div>;
}

function OrgTable(props) {
    const tableRows = props.orgs.map( org => {
        return (
            <tr key={org._id}>
                <td>{org.name}</td>    
            </tr>
        )
    });

    return (
        <table>
            <thead>
                <tr>
                    <th>Organisational Unit</th>
                </tr>
            </thead>
            <tbody>
                {tableRows}
            </tbody>
        </table>
    );
}

export default AdminPanel;
