const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Deletes a user from Firebase Authentication.
 * Only accessible by users with the 'admin' role in Firestore.
 */
exports.deleteUserAuth = functions.https.onCall(async (data, context) => {
    // 1. Check if the request is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    // 2. Verify the caller is an Admin
    const callerUid = context.auth.uid;
    const callerDoc = await admin.firestore().collection('users').doc(callerUid).get();
    
    if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Only system administrators can purge identities.');
    }

    const { uid } = data;
    if (!uid) {
        throw new functions.https.HttpsError('invalid-argument', 'Target UID is required.');
    }

    try {
        // 3. Delete from Firebase Authentication
        await admin.auth().deleteUser(uid);
        return { success: true, message: `User ${uid} successfully purged from Authentication.` };
    } catch (error) {
        console.error("Error deleting user auth:", error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});