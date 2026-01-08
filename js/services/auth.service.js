import { auth } from '../core/firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { Store } from '../core/store.js';

export const AuthService = {
    // Entrar
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Error Login:", error.code);
            throw error; // Lanzamos el error para que la UI lo muestre
        }
    },

    // Salir
    logout: async () => {
        await signOut(auth);
        Store.setUser(null);
        window.location.href = '/'; // Recarga para ir al Login
    },

    // Recuperar Password
    resetPassword: async (email) => {
        await sendPasswordResetEmail(auth, email);
    },

    // "Espía" que mantiene la sesión activa al recargar
    initAuthListener: () => {
        onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Usuario detectado
                const user = {
                    name: 'Diego Gonzales', // (Más adelante lo sacaremos de la base de datos)
                    email: firebaseUser.email,
                    role: 'CEO',
                    uid: firebaseUser.uid
                };
                // Guardamos en el Store Global [cite: 146]
                Store.setUser(user);
            } else {
                Store.setUser(null);
            }
        });
    }
};