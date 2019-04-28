import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { AdminPage } from "./admin";
import { useAuth, AuthContext, AuthPage } from "./auth";
import { useFirebase, FirebaseContext } from "./useFirebase";
import { OpenDoorPage } from "./user";

const styles = createStyles({
  spinner: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center"
  }
});

const App: React.FC<WithStyles<typeof styles>> = ({ classes }) => {
  const { errorMessage, firebase } = useFirebase();
  const authApi = useAuth(firebase);

  return (
    <FirebaseContext.Provider value={firebase}>
      <AuthContext.Provider value={authApi}>
        <CssBaseline />
        {authApi.user === null ? (
          <div className={classes.spinner}>
            <CircularProgress />
          </div>
        ) : authApi.user === "manager" ? (
          <AdminPage />
        ) : authApi.user === "employee" ? (
          <OpenDoorPage />
        ) : (
          <AuthPage />
        )}
        <Snackbar
          open={!!errorMessage}
          onClose={() => firebase.setError("")}
          autoHideDuration={4000}
        >
          <SnackbarContent message={errorMessage} />
        </Snackbar>
      </AuthContext.Provider>
    </FirebaseContext.Provider>
  );
};

export default withStyles(styles)(App);
