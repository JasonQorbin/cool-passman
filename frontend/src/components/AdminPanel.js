import '../styles/AdminPanel.css';
import AdminOrgUnitsTab from './AdminOrgsTab'; 
import AdminUsersTab from './AdminUsersTab';
import { useState } from 'react';

/**
  * Component for the Admin area. Contains two other components that represent the Org and User tabs.
  */
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
    
    const tabButtons = []
    const tabHeadClass = "tab-head";
    const selectedTabHeadClass = "tab-head selected";

    if (activePanel === "Org Units") {
        tabButtons.push(<button key="org" className={selectedTabHeadClass} onClick={setPanelToOrgs}>Org Units</button>);
        tabButtons.push(<button key="users" className={tabHeadClass} onClick={setPanelToUsers}>Users</button>);
    } else {
        tabButtons.push(<button key="org" className={tabHeadClass} onClick={setPanelToOrgs}>Org Units</button>);
        tabButtons.push(<button key="users" className={selectedTabHeadClass} onClick={setPanelToUsers}>Users</button>);
    }
    return (
        <div className="content-wrapper">
            <div className="tab-head-container">
                {tabButtons}
            </div>
            {chosenPanel}            
        </div>
    );
}

export default AdminPanel;
