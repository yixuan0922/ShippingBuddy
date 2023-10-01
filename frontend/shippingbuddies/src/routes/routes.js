import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import LoginPage from "../pages/login.js";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

export default function Root() {
  const drawerWidth = 240;

  const [login, setLogin] = useState(true);
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
    //       </ul>
    //     </nav>
    //   </div>
    //   <div id="detail">
    //     <Outlet />
    //   </div>
    // </>
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />
          <List>
            {['Login', 'Detail'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <Link to={`home`}><ListItemText primary={text} /></Link>
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


