import React, { useState, useRef } from 'react';
import UserForm from './UserForm';
import LoginForm from './LoginForm';
import Cookies from "js-cookie";

function Navigation(props) {
    const [signInStyle, setSignInStyle] = useState({status:'first',style:'dropdown-content'});
    const [logInStyle, setLogInStyle] = useState({status:'first',style:'dropdown-content'});
    const [userStatus, setUserStatus] = useState('loged out');

    // Using useRef to reference the DOM elements
    const signInNavButtonRef = useRef(null);
    const signInContainerRef = useRef(null);
    const logInNavButtonRef = useRef(null);
    const logInContainerRef = useRef(null);

    const toggleSignIn = () => {
        let placeholder;
        if (signInStyle.status === 'first' || signInStyle.status === 'collapsed') {
            placeholder = {status:'expanded',style:'dropdown-content menuExpand'};
            setSignInStyle(placeholder);
            if (signInContainerRef.current) {
              signInContainerRef.current.style.width = ''; // How can I change the css class of the signInContainer instead here, and set width to '' in my css file?
            }
        } else {
            placeholder = {status:'collapsed',style:'dropdown-content menuCollapse'};
            setSignInStyle(placeholder);
            // Adjust parent width after the transition
            setTimeout(() => {
                if(signInNavButtonRef.current && signInContainerRef.current) {
                    signInContainerRef.current.style.width = signInNavButtonRef.current.offsetWidth + 20 + 'px';
                } // how can I clear the width styling from signInContainerRef for other scenarios?
            }, 500); // The duration should match the CSS transition duration
        }
    };

    const toggleLogInStyle = () => {
        let placeholder;
        if (logInStyle.status === 'first' || logInStyle.status === 'collapsed') {
            placeholder = {status:'expanded',style:'dropdown-content menuExpand'};
            setLogInStyle(placeholder);
            if (logInContainerRef.current) {
              logInContainerRef.current.style.width = ''; // How can I change the css class of the signInContainer instead here, and set width to '' in my css file?
            }
        } else {
            placeholder = {status:'collapsed',style:'dropdown-content menuCollapse'};
            setLogInStyle(placeholder);
            setTimeout(() => {
              if(logInNavButtonRef.current && logInContainerRef.current) {
                  logInContainerRef.current.style.width = logInNavButtonRef.current.offsetWidth + 20 + 'px';
              } // how can I clear the width styling from signInContainerRef for other scenarios?
            }, 500); // The duration should match the CSS transition duration
        }
    };

    const logoutUser = () => {
        Cookies.remove('user');
        props.updateParentUser();
    };

    return (
        <nav className="navBar">
            <h1>Movie Master</h1>
            <div id="menuContainer">
                <ul className="navigation">
                    {!props.user.username &&
                    <>
                      <li id="signInContainer" ref={signInContainerRef}>
                        <div className="nav-button nav-link" onClick={toggleSignIn} ref={signInNavButtonRef}>
                            Sign Up
                        </div>
                        <div className={signInStyle.style}>
                            <UserForm />
                        </div>
                      </li>
                      
                      <li id="logInContainer" ref={logInContainerRef}>
                          <div className="nav-button nav-link" onClick={toggleLogInStyle} ref={logInNavButtonRef}>
                              Log in
                          </div>
                          <div className={logInStyle.style}>
                                <LoginForm updateParentUser={() => {
                                    props.updateParentUser();
                                    toggleLogInStyle();
                                }}
                                />
                          </div>
                      </li>
                    </>
                    }
                    {props.user.username &&
                    <>
                      <li>{props.user.username}</li>
                      <li>
                          <div className="nav-button nav-link" onClick={logoutUser}>
                              Log out
                          </div>
                      </li>
                    </>
                    }
                </ul>
            </div>
        </nav>
    );
}

export default Navigation;
