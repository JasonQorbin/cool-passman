import '../styles/SideBar.css'

function SideBar() {
    return (
            <aside id="home-screen-sidebar">
                <ul id="sidebar-items-list">
                    <li><a href="#" className="sidebar-item">Home</a></li>
                    <li><a href="#" className="sidebar-item">My Repositories</a></li>
                    <li><a href="#" className="sidebar-item">My Profile</a></li>
                    <li><a href="#" className="sidebar-item">Admin Panel</a></li>
                </ul>
            </aside>
        
    )
}

export default SideBar;
