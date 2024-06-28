import '../styles/SideBar.css'
import { Link } from 'react-router-dom';

function SideBar() {
    return (
            <aside id="home-screen-sidebar">
                <ul id="sidebar-items-list">
                    <li><Link to="/repos" className="sidebar-item">My Repositories</Link></li>
                    <li><Link to="/profile" className="sidebar-item">My Profile</Link></li>
                    <li><Link to="/admin" className="sidebar-item">Admin Panel</Link></li>
                    <li><Link to="/login" className="sidebar-item">Login</Link></li>
                </ul>
            </aside>
        
    )
}

export default SideBar;
