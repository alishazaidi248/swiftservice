// lib/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDhOIGj-TpZs1rTWzGEKn4AKg25pzGhGfA",
  authDomain: "swiftservice-2a886.firebaseapp.com",
  projectId: "swiftservice-2a886",
  storageBucket: "swiftservice-2a886.appspot.com",
  messagingSenderId: "661499011268",
  appId: "1:661499011268:web:b39960bcc8882230dde991",
  measurementId: "G-V376B7VXJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Storage
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };
