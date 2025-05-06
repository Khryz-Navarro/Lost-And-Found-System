const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.grantAdminRole = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.isAdmin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can grant privileges"
    );
  }

  const email = data.email;
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { isAdmin: true });
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});
