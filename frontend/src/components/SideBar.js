import '../styles/SideBar.css'
import { Link } from 'react-router-dom';

function SideBar(props) {
    const sidebarLinks = [
        <li key="repos"><Link to="/repos" className="sidebar-item">My Repositories</Link></li>,
        <li key="profile"><Link to="/profile" className="sidebar-item">My Profile</Link></li>,
    ];
    
    //Only display the link to the admin panel if an admin is logged in.

    if (props.currentUser.role == "admin") {
        sidebarLinks.push(<li key="admin"><Link to="/admin" className="sidebar-item">Admin Panel</Link></li>);

    }

    return (
            <aside id="home-screen-sidebar">
                <ul id="sidebar-items-list">
                    {sidebarLinks}
                </ul>
            </aside>
        
    )
}

export default SideBar;
