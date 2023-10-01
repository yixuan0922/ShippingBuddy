import { useLocation } from "react-router-dom";
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import PSA from "../assets/PSA.jpg";
export default function EmployeePage(props) {
  console.log(props);
  let { state } = useLocation();
  console.log(state.employee);

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={PSA} />
        </ListItemAvatar>
        <ListItemText primary={state.employee.EmpID} secondary="Employee ID" />
      </ListItem>
      <Divider component="li" />
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={state.employee.EmployeeType}
          secondary="Employee Type"
        />
      </ListItem>
      <Divider component="li" />
      <ListItem alignItems="flex-start">
        <ListItemText primary={state.employee.DOB} secondary="DOB" />
      </ListItem>
      <Divider component="li" />
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={state.employee.FirstName}
          secondary="First Name"
        />
      </ListItem>
      <Divider component="li" />
      <ListItem alignItems="flex-start">
        <ListItemText primary={state.employee.LastName} secondary="Last Name" />
      </ListItem>
      <Divider component="li" />
      <ListItem alignItems="flex-start">
        <ListItemText primary={state.employee.PayZone} secondary="Pay Zone" />
      </ListItem>
      <Divider component="li" />
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={state.employee.EngagementScore}
          secondary="Engagement Score"
        />
      </ListItem>
      <Divider component="li" />
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={state.employee.CurrentEmployeeRating}
          secondary="Current Employee Rating"
        />
      </ListItem>
      <Divider component="li" />
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={state.employee.PerformanceScore}
          secondary="Performance Score"
        />
      </ListItem>
      <Divider component="li" />
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={state.employee.SatisfactionScore}
          secondary="SatisfactionScore"
        />
      </ListItem>
    </List>
  );
}
