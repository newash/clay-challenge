import React from "react";
import { FirebaseContextType } from "../useFirebase";

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
    const detatchDoors = firebase.listenDatabase<DoorType>("/doors", data => {
      setDoors(
        Object.keys(data).map(uid => ({
          ...data[uid],
          uid,
          state: "default"
        }))
      );
    });
    return detatchDoors;
  }, []);

  const openDoor = (uid: string) =>
    firebase.openDoor(uid).then(result => {
      setDoors(
        currentDoors.current.map(door =>
          door.uid === uid
            ? { ...door, state: result ? "success" : "failure" }
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
        result ? 2000 : 1000
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
