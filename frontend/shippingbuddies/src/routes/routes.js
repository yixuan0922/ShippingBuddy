import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import LoginPage from "../pages/login.js";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";
//ui

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";

export default function Root() {
  const [login, setLogin] = useState(false);
  const pages = ["Home", "Search"];

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
      {/* <div id="sidebar">
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
      </div> */}
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              ShippingBuddies
            </Typography>

            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Link
                  to={`/${page}`}
                  key={page}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    sx={{
                      my: 2,
                      color: "white",
                      display: "block",
                    }}
                  >
                    {page}
                  </Button>
                </Link>
              ))}
            </Box>
            <Button
              sx={{
                my: 2,
                color: "white",
                display: "block",
              }}
              onClick={signOut}
            >
              Sign Out
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
