import { auth } from '../core/firebase-config.js'; // Importamos la auth de TU proyecto nuevo
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export const AuthService = {
    // 1. REGISTRAR NUEVO USUARIO
    register: async (email, password, name) => {
        try {
            // Crea el usuario en Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardamos el nombre del usuario (opcional pero recomendado)
            await updateProfile(user, { displayName: name });
            
            console.log("✅ Usuario registrado:", user.email);
            return user;
        } catch (error) {
            console.error("Error en registro:", error.code, error.message);
            throw error; // Lanzamos el error para mostrarlo en pantalla (ej: "correo ya existe")
        }
    },

    // 2. INICIAR SESIÓN
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("✅ Sesión iniciada:", userCredential.user.email);
            return userCredential.user;
        } catch (error) {
            console.error("Error en login:", error.code);
            throw error; // Lanzamos error (ej: "contraseña incorrecta")
        }
    },

    // 3. CERRAR SESIÓN
    logout: async () => {
        try {
            await signOut(auth);
            console.log("🔒 Sesión cerrada");
            return true;
        } catch (error) {
            console.error("Error cerrando sesión:", error);
            return false;
        }
    },

    // 4. VIGILANTE DE SESIÓN (Para saber si estás logueado al recargar)
    onAuthStateChanged: (callback) => {
        return onAuthStateChanged(auth, callback);
    }
};
