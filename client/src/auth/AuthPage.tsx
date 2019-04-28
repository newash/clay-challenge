import useFormal from "@kevinwolf/formal-web";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import * as yup from "yup";
import { getTextFieldProps } from "../formHelpers";
import { AuthContext } from "./useAuth";

const styles = createStyles({
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 300,
    margin: "0 auto"
  }
});

const initialValues = {
  email: "",
  password: "",
  password2: ""
};

const getSchema = (create: boolean) =>
  yup.object<typeof initialValues>().shape({
    email: yup
      .string()
      .email()
      .required(),
    password: yup.string().required(),
    password2: create
      ? yup
          .string()
          .oneOf([yup.ref("password"), null], "Passwords don't match")
          .required()
      : yup.string().notRequired()
  });

const AuthPage: React.FC<WithStyles<typeof styles>> = ({ classes }) => {
  const auth = React.useContext(AuthContext);
  const formal = useFormal(initialValues, {
    schema: getSchema(!auth.hasManager),
    onSubmit: values =>
      auth.hasManager
        ? auth.login(values.email, values.password)
        : auth.createManager(values.email, values.password)
  });
  const title = auth.hasManager ? "Login" : "Create Manager";

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <form {...formal.getFormProps()} className={classes.form}>
        <TextField
          label="Email"
          margin="normal"
          type="email"
          InputLabelProps={{
            shrink: true
          }}
          {...getTextFieldProps(formal, "email")}
        />
        <TextField
          label="Password"
          margin="normal"
          type="password"
          InputLabelProps={{
            shrink: true
          }}
          {...getTextFieldProps(formal, "password")}
        />
        {!auth.hasManager && (
          <TextField
            label="Confirm password"
            margin="normal"
            type="password"
            InputLabelProps={{
              shrink: true
            }}
            {...getTextFieldProps(formal, "password2")}
          />
        )}
        <Button
          variant="contained"
          color="primary"
          size="large"
          {...formal.getSubmitButtonProps()}
          type="submit"
        >
          {title}
        </Button>
      </form>
    </>
  );
};

export default withStyles(styles)(AuthPage);
