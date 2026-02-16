import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDLwnfo-h-x5P8tiJIXdcqT2LmK9cQVB0M",
    authDomain: "foucs-mode-web-app.firebaseapp.com",
    projectId: "foucs-mode-web-app",
    storageBucket: "foucs-mode-web-app.firebasestorage.app",
    messagingSenderId: "295155348623",
    appId: "1:295155348623:web:043aed301d0c22e6d12cfa",
    measurementId: "G-JQY655DHZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { db, analytics };
