import '../styles/PageHeader.css';
import CoolTechLogo from './CoolTechLogo';

/**
  * Component for the page header in the Main Page Layout
  */
function PageHeader(props) {
    const currentUserName = props.currentUser ? `${props.currentUser.firstName} ${props.currentUser.lastName}` : "";
    
    return (
            <header id="page-header">
            <div className="side-by-side">
                <div className="left-left">
                    <h1><CoolTechLogo /><br />Password Manager</h1>
                </div>
                <div className="right-right">
                    <p>Welcome, {currentUserName}</p>
                    <p>Not you? <button onClick={props.logout}>Log out</button></p>
                </div>
            </div>
                <div id="page-header-divider"></div>
            </header>
    );
}

export default PageHeader;
