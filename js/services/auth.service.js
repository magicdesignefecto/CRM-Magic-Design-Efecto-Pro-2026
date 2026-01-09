import { auth } from '../core/firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail // <--- IMPORTANTE: Agregado para recuperar contraseña
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export const AuthService = {
    // 1. REGISTRAR
    register: async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Guardamos el nombre para que no salga "Invitado"
            await updateProfile(user, { displayName: name });
            return user;
        } catch (error) {
            console.error("Error registro:", error);
            throw error;
        }
    },

    // 2. LOGIN
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Error login:", error);
            throw error;
        }
    },

    // 3. RECUPERAR CONTRASEÑA (NUEVO)
    resetPassword: async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return true;
        } catch (error) {
            console.error("Error reset password:", error);
            throw error;
        }
    },

    // 4. LOGOUT
    logout: async () => {
        await signOut(auth);
    },

    onAuthStateChanged: (callback) => {
        return onAuthStateChanged(auth, callback);
    }
};
