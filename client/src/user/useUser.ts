import React from "react";
import { FirebaseContextType } from "../firebase";

export type DoorStateType = "default" | "success" | "failure";

interface DoorType {
  uid: string;
  name: string;
  state: DoorStateType;
}

export const useUser = ({ handleResult, ...firebase }: FirebaseContextType) => {
  const [doors, setDoors] = React.useState<DoorType[]>([]);
  const currentDoors = React.useRef<DoorType[]>([]);
  currentDoors.current = doors;

  React.useEffect(() => {
    const doorsRef = firebase.database.ref("/doors");

    const doorsCB = doorsRef.on("value", data => {
      const doorValue = (data && data.val()) || {};
      setDoors(
        Object.keys(doorValue).map(uid => ({
          ...doorValue[uid],
          uid,
          state: "default"
        }))
      );
    });

    return () => {
      doorsRef.off("value", doorsCB as any);
    };
  }, []);

  const openDoor = (uid: string) =>
    firebase.functions
      .httpsCallable("openDoor")({ uid })
      .then(result => {
        setDoors(
          currentDoors.current.map(door =>
            door.uid === uid
              ? { ...door, state: result.data ? "success" : "failure" }
              : door
          )
        );
        setTimeout(
          () => {
            setDoors(
              currentDoors.current.map(door =>
                door.uid === uid ? { ...door, state: "default" } : door
              )
            );
          },
          result.data ? 2000 : 1000
        );
      });

  return React.useMemo(
    () => ({
      doors,
      open: handleResult(openDoor)
    }),
    [doors]
  );
};
