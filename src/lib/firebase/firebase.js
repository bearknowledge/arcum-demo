import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

let app;

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};
// if a firebase instance doesn't exist, create one
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
}

export const auth = getAuth();
