import './App.css';
import PageHeader from './components/PageHeader';
import SideBar from './components/SideBar';
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import HomeScreen from "./components/HomeScreen";

function App() {
  return (
    <div className="App">
        <PageHeader />
        <div className="content-row">
            <SideBar />
            <HomeScreen />
        </div>
    </div>
  );
}

export default App;
