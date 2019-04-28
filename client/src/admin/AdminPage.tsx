import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Toolbar from "@material-ui/core/Toolbar";
import {
  createStyles,
  withStyles,
  Theme,
  WithStyles
} from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import clsx from "clsx";
import React from "react";
import { AuthContext } from "../auth";
import { FirebaseContext } from "../useFirebase";
import AuthorizationList from "./AuthorizationList";
import DoorList from "./DoorList";
import EmployeeList from "./EmployeeList";
import EventsList from "./EventsList";
import { useAdmin, AdminContext } from "./useAdmin";

const styles = (theme: Theme) =>
  createStyles({
    grow: { flexGrow: 1 },
    tabs: theme.mixins.toolbar,
    content: {
      overflowX: "auto"
    }
  });

const AdminPage: React.FC<WithStyles<typeof styles>> = ({ classes }) => {
  const { logout } = React.useContext(AuthContext);
  const firebase = React.useContext(FirebaseContext);
  const adminApi = useAdmin(firebase);
  const [tabIndex, setTabindex] = React.useState<number>(0);

  return (
    <AdminContext.Provider value={adminApi}>
      <AppBar position="static">
        <Toolbar>
          <Tabs
            value={tabIndex}
            onChange={(_, value) => setTabindex(value)}
            className={clsx(classes.grow, classes.tabs)}
          >
            <Tab className={classes.tabs} label="Employees" />
            <Tab className={classes.tabs} label="Doors" />
            <Tab className={classes.tabs} label="Authorizations" />
            <Tab className={classes.tabs} label="Events" />
          </Tabs>
          <IconButton onClick={logout} color="inherit" title="Logout">
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.content}>
        {tabIndex === 0 && <EmployeeList />}
        {tabIndex === 1 && <DoorList />}
        {tabIndex === 2 && <AuthorizationList />}
        {tabIndex === 3 && <EventsList />}
      </div>
    </AdminContext.Provider>
  );
};

export default withStyles(styles)(AdminPage);
