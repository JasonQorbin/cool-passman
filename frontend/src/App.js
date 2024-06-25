import "./App.css";
import { useState } from 'react';
import { Routes, Route, Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import PageHeader from "./components/PageHeader";
import SideBar from "./components/SideBar"; 
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import HomeScreen from "./components/HomeScreen";
import AdminPanel from "./components/AdminPanel";
import RepoScreen from "./components/RepoScreen";
import ProfileScreen from "./components/ProfileScreen";
import { sessionTokenKey } from "./utils/constants";

function App() {
    const [ currentUser, setCurrentUser ] = useState(null);
    
    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<LoginScreen setCurrentUser={setCurrentUser}/>} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/" element={<PrivateRoute><MainPageLayout currentUser={currentUser}/></PrivateRoute>}>
                    <Route path="/home" element={<HomeScreen />} />
                    <Route path="/repos" element={<RepoScreen />} />
                    <Route path="/profile" element={<ProfileScreen />} />
                    <Route path="/admin" element={<AdminPanel />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;

function MainPageLayout(props) {
    return (
        <div>
            <PageHeader currentUser={props.currentUser}/>
            <div className="content-row">
                <SideBar />
                <Outlet />
            </div>
        </div>
    )
}

const PrivateRoute = (props) => {
  const { children } = props
  const isLoggedIn = sessionStorage.getItem(sessionTokenKey) !== null;
  const location = useLocation()

  return isLoggedIn ? (
    <>{children}</>
  ) : (
    <Navigate
      replace={true}
      to="/login"
    />
  )
}
      //state={{ from: `${location.pathname}${location.search}` }}
