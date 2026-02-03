// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyAakUGeZjhKTDNbTIJuuq6iEiKgVLZrelg",
//   authDomain: "react-netflix-clone-7b40d.firebaseapp.com",
//   projectId: "react-netflix-clone-7b40d",
//   storageBucket: "react-netflix-clone-7b40d.firebasestorage.app",
//   messagingSenderId: "341160698579",
//   appId: "1:341160698579:web:5f8e272b502a34b743aa26",
//   measurementId: "G-HSYRLDPNM5"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const firebaseAuth = getAuth(app);
// export const db = getFirestore(app);

// ✅ Firebase core
import { initializeApp } from "firebase/app";

// ✅ Authentication
import { getAuth } from "firebase/auth";

// ✅ Firestore Database  ✅✅✅ THIS WAS MISSING
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAakUGeZjhKTDNbTIJuuq6iEiKgVLZrelg",
  authDomain: "react-netflix-clone-7b40d.firebaseapp.com",
  projectId: "react-netflix-clone-7b40d",
  storageBucket: "react-netflix-clone-7b40d.firebasestorage.app",
  messagingSenderId: "341160698579",
  appId: "1:341160698579:web:5f8e272b502a34b743aa26",
  measurementId: "G-HSYRLDPNM5"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export both AUTH + FIRESTORE
export const firebaseAuth = getAuth(app);
export const db = getFirestore(app);
