// setadmin.js

// Import the Firebase Admin SDK
const admin = require('firebase-admin');

// IMPORTANT: Replace with the actual path to your service account key file.
// You can generate this file from the Firebase Console:
// Project settings -> Service accounts -> Generate new private key.
// Keep this file secure and do NOT commit it to version control.
const serviceAccount = require('./serviceAccountKey.json');

// Initialize the Firebase Admin SDK with your service account credentials.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get a reference to the Firestore database.
const db = admin.firestore();

/**
 * Sets a user as an administrator by adding their UID to the 'admins' Firestore collection.
 * @param {string} email The email of the user to be set as admin.
 */
async function setAdmin(email) {
  try {
    // Fetch the user record from Firebase Authentication using their email.
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    // Add the user's UID to the 'admins' collection in Firestore.
    // The document ID will be the user's UID, and it will contain their email and an isAdmin flag.
    await db.collection('admins').doc(uid).set({ email: email, isAdmin: true });

    console.log(`Successfully set ${email} (UID: ${uid}) as admin.`);
  } catch (error) {
    console.error(`Error setting ${email} as admin:`, error);
  }
}

// --- ADMIN EMAILS TO BE SET ---
// Define the array of admin emails directly in the script.
// You can add or remove emails from this list as needed.
const ADMIN_EMAILS = [
  'aczaao12@gmail.com',
  '23129398@st.hcmuaf.edu.vn', // Example: Add another admin email here
  // Add more admin emails as needed
];

// Process all predefined admin emails.
(async () => {
  console.log('Attempting to set the following emails as admins:', ADMIN_EMAILS);
  for (const email of ADMIN_EMAILS) {
    await setAdmin(email);
  }
  console.log('Admin setup process completed.');
  // Exit the process after all admins have been processed.
  process.exit(0);
})();