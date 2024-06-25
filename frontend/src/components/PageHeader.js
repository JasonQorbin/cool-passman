import '../styles/PageHeader.css';

function PageHeader(props) {
    const currentUserName = props.currentUser ? `${props.currentUser.firstName} ${props.currentUser.lastName}` : "";

    return (
            <header id="page-header">
            <div className="side-by-side">
                <div className="left-left">
                    <h1>Cool-Tech Password Manager</h1>
                </div>
                <div className="right-right">
                    <p>Welcome, {currentUserName}</p>
                    <p>Not you? <button>Log out</button></p>
                </div>
            </div>
                <div id="page-header-divider"></div>
            </header>
    );
}

export default PageHeader;
