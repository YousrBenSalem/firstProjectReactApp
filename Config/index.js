// Import the functions you need from the SDKs you need
import app from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD9393nZUqAPCg-QttShNtQf8S_BbdnLss",
  authDomain: "whatsapp-699d0.firebaseapp.com",
  projectId: "whatsapp-699d0",
  storageBucket: "whatsapp-699d0.appspot.com",
  messagingSenderId: "196714444014",
  appId: "1:196714444014:web:0eec2594f40b754e402fff",
  measurementId: "G-0LLE9J1DDR",
};

// Initialize Firebase
const firebase = app.initializeApp(firebaseConfig);
export default firebase;
