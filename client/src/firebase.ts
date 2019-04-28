import firebase from "firebase";
import "firebase/functions";
import React from "react";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

firebase.initializeApp(config);

const handleApiResult = (setError: React.Dispatch<string>) => <T extends any[]>(
  func: (...args: T) => Promise<any>
) => (...args: T) =>
  func(...args)
    .then(() => {
      return true;
    })
    .catch(error => {
      setError(error.message);
      return false;
    });

export const createFirebaseContext = (setError: React.Dispatch<string>) => ({
  auth: firebase.auth(),
  functions: firebase.functions(),
  database: firebase.database(),
  setError,
  handleResult: handleApiResult(setError)
});

export type FirebaseContextType = ReturnType<typeof createFirebaseContext>;

export const FirebaseContext = React.createContext<FirebaseContextType>(
  null as any
);
