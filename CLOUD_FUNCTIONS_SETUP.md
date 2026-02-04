# Firebase Cloud Functions Setup

Deleting a user from the **Authentication Tab** cannot be done directly from the browser for security reasons. You must use a **Firebase Cloud Function** which runs on the server and has administrative privileges.

## Step 1: Initialize Cloud Functions
If you haven't already, run this in your terminal:
```bash
firebase init functions
```
- Select **JavaScript** (or TypeScript if you prefer).
- Use the defaults for other prompts.

## Step 2: Install Admin SDK
In your `functions` folder, ensure you have the necessary dependencies:
```bash
cd functions
npm install firebase-admin firebase-functions
```

## Step 3: Implement the Deletion Function
Replace the contents of `functions/index.js` with this code:

```javascript
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
```

## Step 4: Deploy the Function
Run this command to push the security logic to Firebase:
```bash
firebase deploy --only functions
```

---

### Why this is necessary:
Firebase Client SDKs (the ones used in React) are designed to prevent one user from deleting another. If this were possible from the browser, any malicious user could find your API key and delete your entire database. By using a Cloud Function, the deletion happens in a **secure server environment** where we first verify the requester's `admin` role.
