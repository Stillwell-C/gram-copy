import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRymZXoBnlDpO5P_62Yth8--Gs5ANczNo",
  authDomain: "driveproject-34ebb.firebaseapp.com",
  projectId: "driveproject-34ebb",
  storageBucket: "driveproject-34ebb.appspot.com",
  messagingSenderId: "1054972901965",
  appId: "1:1054972901965:web:dcbaedd6863df17b49fa04",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
