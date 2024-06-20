import '../styles/AdminPanel.css';
import AdminOrgUnitsPanel from './AdminOrgsTab'; 
import AdminUsersPanel from './AdminUsersTab';
import { useState } from 'react';

function AdminPanel(){
    const [activePanel, setActivePanel] = useState("Org Units");
    
    function setPanelToOrgs() { setActivePanel("Org Units");}
    function setPanelToUsers() { setActivePanel("Users");}

    const chosenPanel = [];

    switch (activePanel) {
        case "Org Units":
            chosenPanel.push(<AdminOrgUnitsPanel key="orgs"/>);
            break;
        case "Users":
            chosenPanel.push(<AdminUsersPanel key="users" />);
            break;
        default:
            chosenPanel.push(<AdminOrgUnitsPanel key="orgs" />);
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
