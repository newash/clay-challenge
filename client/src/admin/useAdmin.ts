import React from "react";
import { FirebaseContextType } from "../firebase";

interface EmployeeType {
  uid: string;
  email: string;
}

interface DoorType {
  uid: string;
  name: string;
}

interface AuthorizationType {
  uid: string;
  employeeId: string;
  doorId: string;
}

interface EventType {
  uid: string;
  date: number;
  doorId: string;
  employeeId: string;
  success: boolean;
}

export const useAdmin = ({
  handleResult,
  ...firebase
}: FirebaseContextType) => {
  const [empDirty, setEmpDirty] = React.useState<boolean>(true);
  const [employees, setEmployees] = React.useState<EmployeeType[]>([]);
  const [doors, setDoors] = React.useState<DoorType[]>([]);
  const [auths, setAuths] = React.useState<AuthorizationType[]>([]);
  const [events, setEvents] = React.useState<EventType[]>([]);

  React.useEffect(() => {
    if (!empDirty) return;

    const getEmployees = firebase.functions.httpsCallable("getEmployees");
    getEmployees().then(result => {
      setEmpDirty(false);
      setEmployees(result.data);
    });
  }, [empDirty]);

  React.useEffect(() => {
    const doorsRef = firebase.database.ref("/doors");
    const authsRef = firebase.database.ref("/authorizations");
    const eventRef = firebase.database.ref("/events");

    const doorsCB = doorsRef.on("value", data => {
      const doorValue = (data && data.val()) || {};
      setDoors(
        Object.keys(doorValue).map(uid => ({
          ...doorValue[uid],
          uid
        }))
      );
    });
    const authsCB = authsRef.on("value", data => {
      const authValue = (data && data.val()) || {};
      setAuths(
        Object.keys(authValue).map(uid => ({
          ...authValue[uid],
          uid
        }))
      );
    });
    const eventCB = eventRef.on("value", data => {
      const eventValue = (data && data.val()) || {};
      setEvents(
        Object.keys(eventValue).map(uid => ({
          ...eventValue[uid],
          uid
        }))
      );
    });

    return () => {
      doorsRef.off("value", doorsCB as any);
      authsRef.off("value", authsCB as any);
      eventRef.off("value", eventCB as any);
    };
  }, []);

  const addEmployee = (data: { email: string; password: string }) =>
    firebase.functions
      .httpsCallable("addEmployee")(data)
      .then(() => setEmpDirty(true));

  const modifyEmployee = (data: {
    uid: string;
    email: string;
    password: string;
  }) =>
    firebase.functions
      .httpsCallable("modifyEmployee")(data)
      .then(() => setEmpDirty(true));

  const deleteEmployee = (uid: string) =>
    firebase.functions
      .httpsCallable("deleteEmployee")({ uid })
      .then(() => setEmpDirty(true));

  const addDoor = (data: { name: string }) =>
    firebase.database.ref("/doors").push(data);

  const modifyDoor = ({ uid, ...data }: { uid: string; name: string }) =>
    firebase.database.ref("/doors/" + uid).set(data);

  const deleteDoor = (uid: string) =>
    firebase.database.ref("/doors/" + uid).remove();

  const addAuth = (data: { employeeId: string; doorId: string }) =>
    firebase.database.ref("/authorizations").push(data);

  const deleteAuth = (uid: string) => {
    return firebase.database.ref("/authorizations/" + uid).remove();
  };

  return React.useMemo(
    () => ({
      employees: {
        values: employees,
        add: handleResult(addEmployee),
        modify: handleResult(modifyEmployee),
        delete: handleResult(deleteEmployee)
      },
      doors: {
        values: doors,
        add: handleResult(addDoor),
        modify: handleResult(modifyDoor),
        delete: handleResult(deleteDoor)
      },
      authorizations: {
        values: auths,
        add: handleResult(addAuth),
        delete: handleResult(deleteAuth)
      },
      events: {
        values: events
      }
    }),
    [employees, doors, auths, events]
  );
};

export const AdminContext = React.createContext<ReturnType<typeof useAdmin>>(
  null as any
);
