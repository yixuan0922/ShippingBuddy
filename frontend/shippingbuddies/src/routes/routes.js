import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import LoginPage from "../pages/login.js";
import {  onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";
export default function Root() {
  const [login, setLogin] = useState(false);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLogin(true);
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      // const uid = user.uid;
      // ...
    } else {
      setLogin(false);

      // User is signed out
      // ...
    }
  });
  function signOut() {
    auth.signOut();
  }
  if (!login) {
    return <LoginPage />;
  }
  return (
    <>
      <div id="sidebar">
        <nav>
          <ul>
            <li>
              <Link to={`home`}>Home</Link>
            </li>
            <li>
              <Link to={`login`}>Your Friend</Link>
            </li>
            <li>
              <button onClick={signOut}>Sign out</button>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
