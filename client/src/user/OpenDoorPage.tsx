import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import {
  createStyles,
  withStyles,
  Theme,
  WithStyles
} from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ClosedIcon from "@material-ui/icons/Lock";
import OpenIcon from "@material-ui/icons/LockOpen";
import clsx from "clsx";
import React from "react";
import { AuthContext } from "../auth";
import { FirebaseContext } from "../firebase";
import { useUser } from "./useUser";

const styles = (theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1
    },
    container: {
      maxWidth: 1100,
      margin: "0 auto",
      justifyContent: "center"
    },
    button: {
      margin: theme.spacing.unit * 3,
      height: 200,
      width: 300
    },
    success: {
      "&$disabled": {
        backgroundColor: green[500],
        color: theme.palette.getContrastText(green[500]),
        "&:hover": {
          backgroundColor: green[500]
        }
      }
    },
    failure: {
      "&$disabled": {
        backgroundColor: red[500],
        color: theme.palette.getContrastText(red[500]),
        "&:hover": {
          backgroundColor: red[500]
        }
      }
    },
    disabled: {},
    leftIcon: {
      marginRight: theme.spacing.unit
    }
  });

const OpenDoorPage: React.FC<WithStyles<typeof styles>> = ({ classes }) => {
  const { logout } = React.useContext(AuthContext);
  const firebase = React.useContext(FirebaseContext);
  const userApi = useUser(firebase);
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Open Doors
          </Typography>
          <IconButton onClick={logout} color="inherit" title="Logout">
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <FormGroup className={classes.container} row>
        {userApi.doors.map(door => {
          const Icon = door.state === "success" ? OpenIcon : ClosedIcon;
          return (
            <Button
              key={door.uid}
              variant="contained"
              disabled={door.state !== "default"}
              classes={{
                root: classes.button,
                contained: clsx({
                  [classes.success]: door.state === "success",
                  [classes.failure]: door.state === "failure"
                }),
                disabled: classes.disabled
              }}
              onClick={() => userApi.open(door.uid)}
            >
              <Icon className={classes.leftIcon} />
              {door.name}
            </Button>
          );
        })}
      </FormGroup>
    </>
  );
};

export default withStyles(styles)(OpenDoorPage);
