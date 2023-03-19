import { useState, useEffect } from "react";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import axios from "axios";

const formatAuthUser = (firebaseUser, dbUser) => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    id: dbUser.id,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    companyId: dbUser.company_id,
    createdAt: new Date(dbUser.created_at),
});

const getUserData = async (user) => {
    return axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/users?email=${user.email}`)
        .then((res) => {
            if (res.data.error) {
                console.log(res.data.error);
            } else {
                return formatAuthUser(user, res.data.users[0]);
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

export default function useFirebaseAuth() {
    const [authUser, setAuthUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const authStateChanged = async (authState) => {
        if (!authState) {
            setAuthUser(null);
            setAuthLoading(false);
            return;
        }

        setAuthLoading(true);
        let formattedUser = await getUserData(authState);
        setAuthUser(formattedUser);
        setAuthLoading(false);
    };

    const clear = () => {
        setAuthUser(null);
        setAuthLoading(true);
    };

    const login = (email, password) =>
        signInWithEmailAndPassword(auth, email, password);

    const register = (email, password) =>
        createUserWithEmailAndPassword(auth, email, password);

    const logout = () => signOut(auth).then(clear);

    const resetPassword = (email) => sendPasswordResetEmail(auth, email);


    // listen for firebase state change

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);
        return () => unsubscribe();
    }, []);

    return {
        authUser,
        authLoading,
        login,
        register,
        logout,
        resetPassword
    };
}

