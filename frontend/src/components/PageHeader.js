import '../styles/PageHeader.css';

function PageHeader(props) {
    const currentUserName = props.currentUser ? `${props.currentUser.firstName} ${props.currentUser.lastName}` : "";
    
    const showToastMessage = props.showToastMessage;

    return (
            <header id="page-header">
            <div className="side-by-side">
                <div className="left-left">
                    <h1>Cool-Tech Password Manager</h1>
                </div>
                <div className="right-right">
                    <p>Welcome, {currentUserName}</p>
                    <p>Not you? <button onClick={()=>{props.test();}}>Log out</button></p>
                    <p><button onClick={()=> {
                    if (props.currentuser) {
                        showToastMessage("Current user", `${props.currentUser.firstName} ${props.currentUser.lastName} | ${props.currentUser._id}`);
                    } else {

                        showToastMessage("Current user", `None`);
                    }
                    }}>Show current user</button></p>
                    
                </div>
            </div>
                <div id="page-header-divider"></div>
            </header>
    );
}

export default PageHeader;
