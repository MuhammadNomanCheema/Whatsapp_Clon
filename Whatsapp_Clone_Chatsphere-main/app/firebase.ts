// firebase.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
    getAuth,
    getReactNativePersistence,
    initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyApSaPH95aiViyP-MDOddfiMBTPksC_ziA",
    authDomain: "chatsphere-f8016.firebaseapp.com",
    projectId: "chatsphere-f8016",
    storageBucket: "chatsphere-f8016.appspot.com",
    messagingSenderId: "765633751045",
    appId: "1:765633751045:web:f8ce1dad8bdc9c1aa4146c",
};

// ✅ Only initialize Firebase once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Safe Auth with Persistence (avoid re-initializing)
let auth;
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
} catch (error) {
    auth = getAuth(app);
}

// 🔥 Export services
export const db = getFirestore(app);
export const storage = getStorage(app);
export { auth };

