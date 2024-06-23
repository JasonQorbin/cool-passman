import "./App.css";
import { Routes, Route, Outlet } from "react-router-dom";
import PageHeader from "./components/PageHeader";
import SideBar from "./components/SideBar"; 
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import HomeScreen from "./components/HomeScreen";
import AdminPanel from "./components/AdminPanel";
import RepoScreen from "./components/RepoScreen";
import ProfileScreen from "./components/ProfileScreen";

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/" element={<MainPageLayout />}>
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

function MainPageLayout() {
    return (
        <div>
            <PageHeader />
            <div className="content-row">
                <SideBar />
                <Outlet />
            </div>
        </div>
    )
}
