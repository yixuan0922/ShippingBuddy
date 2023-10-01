import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import LoginPage from "../pages/login.js";

export default function Root() {
  const [login, setLogin] = useState(false);
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
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
