import '../styles/AdminPanel.css';
import AdminOrgUnitsTab from './AdminOrgsTab'; 
import AdminUsersTab from './AdminUsersTab';
import { useState } from 'react';

function AdminPanel(props){
    const [activePanel, setActivePanel] = useState("Org Units");
    
    function setPanelToOrgs() { setActivePanel("Org Units");}
    function setPanelToUsers() { setActivePanel("Users");}

    const chosenPanel = [];

    switch (activePanel) {
        case "Org Units":
            chosenPanel.push(<AdminOrgUnitsTab key="orgs" showToastMessage={props.showToastMessage}/>);
            break;
        case "Users":
            chosenPanel.push(<AdminUsersTab key="users" showToastMessage={props.showToastMessage}/>);
            break;
        default:
            chosenPanel.push(<AdminOrgUnitsTab key="orgs" showToastMessage={props.showToastMessage}/>);
    }

    return (
        <div>
            <button onClick={setPanelToOrgs}>Org Units</button>
            <button onClick={setPanelToUsers}>Users</button>
            {chosenPanel}            
        </div>
    );
}

export default AdminPanel;
