import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

const hasAdmin = async () => {
  const result = await admin.auth().listUsers();
  return result.users.some(
    user => !!user.customClaims && (user.customClaims as any).admin === true
  );
};

const checkCurrentAdmin = async (context: functions.https.CallableContext) => {
  if (context.auth) {
    const currentUser = await admin.auth().getUser(context.auth.uid);
    if (
      currentUser.customClaims &&
      (currentUser.customClaims as any).admin === true
    ) {
      return;
    }
  }
  throw new functions.https.HttpsError(
    "permission-denied",
    "Only managers can call this function."
  );
};

export const hasManager = functions.https.onCall(async () => {
  return await hasAdmin();
});

export const addManager = functions.https.onCall(
  async (data: { email: string }) => {
    if (await hasAdmin()) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "There is already a manager."
      );
    }
    try {
      const user = await admin.auth().getUserByEmail(data.email);
      await admin.auth().setCustomUserClaims(user.uid, {
        admin: true
      });
      return `Request fulfilled! ${data.email} is now a manager.`;
    } catch (error) {
      throw new functions.https.HttpsError("unknown", error.message);
    }
  }
);

export const getEmployees = functions.https.onCall(async (_, context) => {
  await checkCurrentAdmin(context);
  const result = await admin.auth().listUsers();
  return result.users
    .filter(
      user => !user.customClaims || (user.customClaims as any).admin !== true
    )
    .map(({ uid, email }) => {
      return { uid, email };
    });
});

export const addEmployee = functions.https.onCall(
  async (data: { email: string; password: string }, context) => {
    await checkCurrentAdmin(context);
    try {
      await admin.auth().createUser({
        email: data.email,
        emailVerified: true,
        password: data.password
      });
      return `User ${data.email} is created.`;
    } catch (error) {
      throw new functions.https.HttpsError("unknown", error.message);
    }
  }
);

export const modifyEmployee = functions.https.onCall(
  async (
    data: {
      uid: string;
      email: string;
      password?: string;
    },
    context
  ) => {
    await checkCurrentAdmin(context);
    try {
      await admin.auth().updateUser(data.uid, {
        email: data.email,
        ...(data.password ? { password: data.password } : {})
      });
      return `User ${data.email} is updated.`;
    } catch (error) {
      throw new functions.https.HttpsError("unknown", error.message);
    }
  }
);

export const deleteEmployee = functions.https.onCall(
  async (data: { uid: string }, context) => {
    await checkCurrentAdmin(context);
    try {
      await admin.auth().deleteUser(data.uid);
      return `User ${data.uid} is deleted.`;
    } catch (error) {
      throw new functions.https.HttpsError("unknown", error.message);
    }
  }
);

export const openDoor = functions.https.onCall(
  async (data: { uid: string }, context) => {
    try {
      const employeeId = context.auth && context.auth.uid;

      const authValue: Record<string, { employeeId: string; doorId: string }> =
        (await admin
          .database()
          .ref("/authorizations")
          .once("value")).val() || {};

      const result = Object.keys(authValue).some(
        key =>
          authValue[key].employeeId === employeeId &&
          authValue[key].doorId === data.uid
      );

      await admin
        .database()
        .ref("/events")
        .push({
          date: Date.now(),
          doorId: data.uid,
          employeeId,
          success: result
        });

      return result;
    } catch (error) {
      throw new functions.https.HttpsError("unknown", error.message);
    }
  }
);
