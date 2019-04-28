import React from "react";
import { FirebaseContextType } from "../useFirebase";

export type UserType = "none" | "employee" | "manager" | null;

export const useAuth = ({ handleResult, ...firebase }: FirebaseContextType) => {
  const [hasManager, setHasManager] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<UserType>(null);

  React.useEffect(() => {
    const callHasManager = firebase.functions.httpsCallable("hasManager");
    callHasManager().then(result => {
      setHasManager(result.data);
    });
    const unsub = firebase.auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        currentUser
          .getIdTokenResult()
          .then(idTokenResult =>
            setUser(!!idTokenResult.claims.admin ? "manager" : "employee")
          )
          .catch(error => firebase.setError(error.message));
      } else {
        setUser("none");
      }
    });
    return unsub;
  }, []);

  const logout = () => firebase.auth.signOut();

  const login = (email: string, password: string) =>
    firebase.auth.signInWithEmailAndPassword(email, password);

  const createManager = (email: string, password: string) =>
    firebase.auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const addManager = firebase.functions.httpsCallable("addManager");
        return addManager({ email });
      })
      .then(() => {
        setHasManager(true);
        return firebase.auth.signOut();
      })
      .then(() => firebase.auth.signInWithEmailAndPassword(email, password));

  return React.useMemo(
    () => ({
      hasManager,
      user,
      logout: handleResult(logout),
      login: handleResult(login),
      createManager: handleResult(createManager)
    }),
    [hasManager, user]
  );
};

export const AuthContext = React.createContext<ReturnType<typeof useAuth>>(
  null as any
);
