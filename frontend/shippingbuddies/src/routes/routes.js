import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import LoginPage from "../pages/login.js";
import { onAuthStateChanged } from "firebase/auth";
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
    // <>
    //   <div id="sidebar">
    //     <nav>
    //       <ul>
    //         <li>
    //           <Button variant="contained"> <Link to={`home`}>Home</Link></Button>

    //         </li>
    //         <li>
    //           <Link to={`login`}>Your Friend</Link>
    //         </li>
    // <li>
    //           <button onClick={signOut}>Sign out</button>
    //         </li>
    //       </ul>
    //     </nav>
    //   </div>
    //   <div id="detail">
    //     <Outlet />
    //   </div>
    // </>
    <div>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />
          <List>
            {["Login", "Detail"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <Link to={`home`}>
                    <ListItemText primary={text} />
                  </Link>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>
      <div id="detail">
        <Outlet />
      </div>
    </div>
  );
}
