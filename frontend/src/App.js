import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import React, { useState } from 'react';
import { Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import PageHeader from "./components/PageHeader";
import SideBar from "./components/SideBar"; 
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import AdminPanel from "./components/AdminPanel";
import RepoScreen from "./components/RepoScreen";
import ProfileScreen from "./components/ProfileScreen";
import ToastMessage from "./components/ToastMessage";
import LoadingWidget from "./components/LoadingWidget";
import { sessionTokenKey } from "./utils/constants";
import { getData } from "./utils/fetching";

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
        this.logout = this.logout.bind(this);

    }
    
    checkCurrentUser() {
        if (sessionStorage.getItem(sessionTokenKey) && !this.state.currentUser) {
            getData('/api/users/self', this.setCurrentUser);
        }
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

        this.setState(
            {
                toastTitle : title,
                toastMessage : message,
                toastVariant : variant,
                toastMessageVisible : true
            });
    }

    logout() {
        sessionStorage.removeItem(sessionTokenKey);
        this.setState({currentUser : null});
    }

    render() {
        const mainPageRoutes = [
            (<Route key="repos" path="/repos"
                element={<RepoScreen showToastMessage={this.showToastMessage} currentUser={this.state.currentUser}/>} />),
            (<Route key="profile" path="/profile" element={<ProfileScreen showToastMessage={this.showToastMessage}
                setCurrentUser={this.setCurrentUser} />} />),
            (<Route key="admin" path="/admin" element={<AdminPanel
                showToastMessage={this.showToastMessage}
                currentUser={this.state.currentUser}
            />} />)
        ];


        return (
            <div className="App">
                <Routes>
                    <Route path="/login" 
                        element={<LoginScreen setCurrentUser={this.setCurrentUser}
                        showToastMessage={this.showToastMessage} 
                        currentUser={this.state.currentUser} />} 
                    />
                    <Route path="/register"
                        element={<RegisterScreen
                        showToastMessage={this.showToastMessage}
                        />}
                    />
                    <Route path="/"
                        element={(<PrivateRoute currentUser={this.state.currentUser}>
                                    <MainPageLayout 
                                        currentUser={this.state.currentUser}
                                        setCurrentUser={this.setCurrentUser}
                                        toastVisible={this.state.toastMessageVisible}
                                        changeToastVisibility={this.changeToastVisibility}
                                        showToastMessage={this.showToastMessage}
                                        toastTitle={this.state.toastTitle}
                                        toastMessage={this.state.toastMessage}
                                        toastVariant={this.state.toastVariant}
                                        test={this.test}
                                        logout={this.logout}
                                    />
                                </PrivateRoute>)}
                    >
                        {mainPageRoutes}
                    </Route>
                </Routes>
            </div>
        );
    }
}

export default App;

function MainPageLayout(props) {
    
    const [loadingUser, setLoadingUser] = useState(false);

    function loadCurrentUser() {
        setLoadingUser(true);
        getData('/api/users/self',
            data => {
                props.setCurrentUser(data);
                setLoadingUser(false);
            });
    }

    if (!props.currentUser) {
        if (!loadingUser) {
            setLoadingUser(true);
            loadCurrentUser();
        }
    }

    if (loadingUser) {
        return <LoadingWidget />;
    }

    return (
        <div>
            <PageHeader 
                currentUser={props.currentUser}
                showToastMessage={props.showToastMessage}
                logout={props.logout}
            />
            <div className="content-row">
                <SideBar currentUser={props.currentUser}/>
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

  return isLoggedIn ? (
    <>{children}</>
  ) : (
    <Navigate
      replace={true}
      to="/login"
    />
  )
}
