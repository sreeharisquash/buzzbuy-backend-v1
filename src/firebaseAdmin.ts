// src/backend/firebaseAdmin.ts

import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
const serviceAccount = require("../secrets/firebaseServiceAccountKey.json"); // Update with your own service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

/**
 * Function to reset a user's password using Firebase Authentication
 * @param email User's email address
 * @param newPassword New password to set
 */
export const resetUserPassword = async (email: string, newPassword: string) => {
  try {
    const user = await auth.getUserByEmail(email);
    await auth.updateUser(user.uid, { password: newPassword });
    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export default admin;
