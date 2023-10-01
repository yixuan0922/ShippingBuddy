import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, Outlet } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import PSA from "../assets/PSA.jpg";
export default function EmployeeCard(props) {
  console.log(props);
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardMedia
          component="div"
          sx={{
            // 16:9
            pt: "56.25%",
          }}
          image={PSA}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {props.firstName} {props.lastName}
          </Typography>
          <List>
            <ListItem disablePadding>
              <ListItemText primary={props.empID} secondary={"Employee ID"} />
            </ListItem>{" "}
            <Divider />
            <ListItem disablePadding>
              <ListItemText primary={props.title} secondary={"Title"} />
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemText primary={props.type} secondary={"Employee Type"} />
            </ListItem>
          </List>
        </CardContent>
        <CardActions>
          <Link to={"/EmployeePage"} state={{ employee: props.employee }}>
            <Button size="small">View</Button>
          </Link>
          <Button size="small">Edit</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
