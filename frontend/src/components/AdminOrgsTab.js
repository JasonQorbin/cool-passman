import '../styles/AdminOrgsTab.css';
import { getData, postData } from '../utils/fetching';
import LoadingWidget from './LoadingWidget';
import SimpleItemTable from './SimpleItemTable';
import TransparentTextInputOverlay from './TransparentTextInputOverlay';
import { useState } from 'react';

function AdminOrgUnitsPanel() {
    const [orgs, setOrgs] = useState([]);
    const [loadingOrgs, setLoadingOrgs] = useState(false);
    const [loadedOrgs, setLoadedOrgs] = useState(false);

    const [depts, setDepts] = useState([]);
    const [loadingDepts, setLoadingDepts] = useState(false);
    const [loadedDepts, setLoadedDepts] = useState(false);
    
    const [errorState, setErrorState] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [selectedDept, setSelectedDept] = useState(null);

    const [overLayDisplayed, setOverlayDisplay] = useState(false);

    if (!loadedOrgs && !loadingOrgs) {
        getData('/api/org', setOrgs, setLoadingOrgs, setLoadedOrgs, setErrorMsg, setErrorState)
            .catch( () => console.log("Error while fetching OU data"));
    }

    if ( loadedOrgs && selectedOrg && !loadingDepts && !loadedDepts ) {
        getData(`/api/org/${selectedOrg}`, setDepts, setLoadingDepts, setLoadedDepts, setErrorMsg, setErrorState)
            .catch( () => console.log("Error while fetching department data"));
    }
    
    function selectNewOrg(newOrg) {
        setSelectedOrg(newOrg);
        setSelectedDept(null);
        setLoadedDepts(false);
    }

    function cancelOverlay() {
        setOverlayDisplay(null);
    }

    function addOrgUnitButtonPress() {
        setOverlayDisplay({
            title: "New OU Name:",
            defaultValue : "",
            callback : postNewOU,
            cancelCallback : cancelOverlay
        })
    }

    function postNewOU(newName) {
        setOverlayDisplay(null);
        const objectToPost = { name : newName };
        postData('/api/org', objectToPost, handleAddOrgResult);
    }

    function handleAddOrgResult(response) {
        if (response.status == 201) {
            setSelectedDept(null);
            setSelectedOrg(null);
            response.json()
                .then( data => {
                    //Todo: Toast showing success
                    const newOrgs = Array.from(orgs);
                    newOrgs.push(data);
                    setOrgs(newOrgs);
                });   
        } else {
            //Toast showing error message
        }
        
    }

    const overlay = [];
    if (overLayDisplayed) {
        overlay.push(<TransparentTextInputOverlay key="overlay"
            title={overLayDisplayed.title}
            defaultValue={overLayDisplayed.defaultValue}
            submitCallback = {overLayDisplayed.callback}
            closeCallback = {cancelOverlay}
        />)
    }

    const orgUnitButtons = [];
    if (loadedOrgs && !errorState) {
        orgUnitButtons.push(<button key="add-ou-button" onClick={addOrgUnitButtonPress}>Add OU</button>);
        if (selectedOrg) {
            orgUnitButtons.push(<button key="rename-ou-button">Rename OU</button>);
            orgUnitButtons.push(<button key="delete-ou-button">Delete OU</button>);
        }
    }
    
    const deptButtons = [];
    if (loadedDepts && !errorState) {
        deptButtons.push(<button key="add-dept-button">Add Dept</button>);
        if (selectedDept) {
            deptButtons.push(<button key="rename-dept-button">Rename Dept</button>);
            deptButtons.push(<button key="delete-dept-button">Delete Dept</button>);
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

    if ( loadedOrgs && selectedOrg && loadingDepts || loadedDepts ) {
        if (loadingDepts) {
            tableGroups.push(<LoadingWidget key="depts" />);
        } else {
            tableGroups.push(
                <div className="table-group" key="depts">
                    {deptButtons}
                    <SimpleItemTable title="Departments" items={depts}  setSelectedCb={setSelectedDept} selected={selectedDept} />
                </div>
            );
        }
    }


    if (errorState) {
        return <div>Error: {errorMsg}</div>;
    } else {
        return (
            <div id="admin-org-unit-tab">
                {overlay}
                {tableGroups}
            </div>
        );
    }
}

export default AdminOrgUnitsPanel;
