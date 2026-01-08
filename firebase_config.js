// js/firebase-config.js

// IMPORTANT: Replace the following config with your actual Firebase project details.
// You can get this from the Firebase Console -> Project Settings -> General -> Your Apps
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
// Check if firebase is defined (it should be loaded from the script tag in index.html)
let db;

try {
    if (typeof firebase !== 'undefined') {
        const app = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log("Firebase initialized successfully");
    } else {
        console.error("Firebase SDK not loaded");
        // We will handle this gracefully in db.js by falling back to mock data
    }
} catch (error) {
    console.error("Error initializing Firebase:", error);
    console.warn("Falling back to Mock Data mode if available.");
}

// Export db for use in other files
// In a module system we would export, but here we attach to window or just rely on global scope order
// For safety in this simple setup:
window.db = db;
