import { act, renderHook } from "react-hooks-testing-library";
import { FirebaseContextType } from "../useFirebase";
import { useUser } from "./useUser";

describe("useUser custom hook", () => {
  const detacher = jest.fn(() => {});
  const mockFirebase: FirebaseContextType = {
    database: null as any,
    functions: null as any,
    auth: null as any,
    setError: null as any,
    handleResult: jest.fn(
      <T extends any[]>(func: (...args: T) => Promise<any>) => (...args: T) =>
        func(...args)
          .then(() => true)
          .catch(() => false)
    ),
    listenDatabase: jest.fn(
      <T extends {}>(
        path: string,
        callback: (data: Record<string, T>) => void
      ) => {
        callback({ a: {} as T, b: {} as T, c: {} as T });
        return detacher;
      }
    ),
    openDoor: (uid: string) => Promise.resolve(uid === "a")
  };

  it("returns initial list of doors", () => {
    const { result } = renderHook(() => useUser(mockFirebase));
    expect(result.current.doors).toEqual([
      { state: "default", uid: "a" },
      { state: "default", uid: "b" },
      { state: "default", uid: "c" }
    ]);
  });

  it("removes DB listener on unmount", () => {
    detacher.mockClear();
    const { unmount } = renderHook(() => useUser(mockFirebase));
    expect(detacher.mock.calls.length).toBe(0);
    unmount();
    expect(detacher.mock.calls.length).toBe(1);
  });

  it("updates door state for an unsuccessful open request", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUser(mockFirebase)
    );
    expect(result.current.doors.find(d => d.uid === "b")!.state).toBe(
      "default"
    );
    act(() => {
      result.current.open("b");
    });
    await waitForNextUpdate();
    expect(result.current.doors.find(d => d.uid === "b")!.state).toBe(
      "failure"
    );
    await waitForNextUpdate();
    expect(result.current.doors.find(d => d.uid === "b")!.state).toBe(
      "default"
    );
  });

  it("updates door state for a successful open request", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useUser(mockFirebase)
    );
    expect(result.current.doors.find(d => d.uid === "a")!.state).toBe(
      "default"
    );
    act(() => {
      result.current.open("a");
    });
    await waitForNextUpdate();
    expect(result.current.doors.find(d => d.uid === "a")!.state).toBe(
      "success"
    );
    await waitForNextUpdate();
    expect(result.current.doors.find(d => d.uid === "a")!.state).toBe(
      "default"
    );
  });
});
