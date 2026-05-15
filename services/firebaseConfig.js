import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjQMILM9JKCT8QSKHfafLOwYmTOpo9mhM",
  authDomain: "bookshelfstore12.firebaseapp.com",
  projectId: "bookshelfstore12",
  storageBucket: "bookshelfstore12.firebasestorage.app",
  messagingSenderId: "1091203038453",
  appId: "1:1091203038453:web:6e91449cf7a5da4df9d9bc",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export default app;
