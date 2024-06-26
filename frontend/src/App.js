import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import PageHeader from "./components/PageHeader";
import SideBar from "./components/SideBar"; 
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import HomeScreen from "./components/HomeScreen";
import AdminPanel from "./components/AdminPanel";
import RepoScreen from "./components/RepoScreen";
import ProfileScreen from "./components/ProfileScreen";
import ToastMessage from "./components/ToastMessage";
import { sessionTokenKey } from "./utils/constants";

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            currentUser : null,
            toastMessageVisible : false,
            toastTitle : "",
            toastMessage : "",
            toastVariant : "primary",
            
        };

        this.changeToastVisibility = this.changeToastVisibility.bind(this);
        this.showToastMessage = this.showToastMessage.bind(this);
        this.setCurrentUser = this.setCurrentUser.bind(this);
    }
    
    setCurrentUser(newUser) {
        this.setState({currentUser : newUser});
    }

    changeToastVisibility(newState) {
        this.setState({toastMessageVisible : newState});
    }
    
    showToastMessage(title, message, variant) {
        if (variant === undefined) {
            variant = "primary";
        }

        this.setState({toastTitle : title});
        this.setState({toastMessage : message});
        this.setState({toastVariant : variant});
        this.setState({toastMessageVisible : true});
    }

    render() {
        return (
            <div className="App">
                <Routes>
                    <Route path="/login" element={<LoginScreen setCurrentUser={this.setCurrentUser}/>} />
                    <Route path="/register" element={<RegisterScreen />} />
                    <Route path="/" element={(
                        <PrivateRoute>
                            <MainPageLayout 
                                currentUser={this.currentUser}
                                toastVisible={this.state.toastMessageVisible}
                                changeToastVisibility={this.changeToastVisibility}
                                showToastMessage={this.showToastMessage}
                                toastTitle={this.state.toastTitle}
                                toastMessage={this.state.toastMessage}
                                toastVariant={this.state.toastVariant}
                            />
                        </PrivateRoute>
                    )}>
                        <Route path="/home" element={<HomeScreen />} />
                        <Route path="/repos" element={<RepoScreen />} />
                        <Route path="/profile" element={<ProfileScreen />} />
                        <Route path="/admin" element={<AdminPanel />} />
                    </Route>
                </Routes>
            </div>
        );
    }
}

export default App;

function MainPageLayout(props) {
    return (
        <div>
            <PageHeader 
                currentUser={props.currentUser}
                showToastMessage={props.showToastMessage}
            />
            <div className="content-row">
                <SideBar />
                <Outlet />
                <ToastMessage 
                    show={props.toastVisible}
                    setShow={props.changeToastVisibility} 
                    title={props.toastTitle}
                    message={props.toastMessage}
                    variant={props.toastVariant}
                />
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
