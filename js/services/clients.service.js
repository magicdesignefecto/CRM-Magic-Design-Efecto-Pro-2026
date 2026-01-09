import { db, auth } from '../core/firebase-config.js'; // Importamos auth para saber quién es
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc, 
    getDoc, 
    query, 
    orderBy,
    where // <--- Importante: Para filtrar
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const COLLECTION_NAME = 'clients';

export const ClientsService = {
    // 1. OBTENER SOLO MIS CLIENTES
    getAll: async () => {
        try {
            const user = auth.currentUser;
            if (!user) return []; // Si no hay usuario, no devolvemos nada

            // La consulta mágica: "Donde userId sea igual a MI id"
            const q = query(
                collection(db, COLLECTION_NAME), 
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error obteniendo clientes:", error);
            // Si falla por falta de índice, avisa en consola
            return [];
        }
    },

    // 2. CREAR CLIENTE (Con mi firma)
    create: async (clientData) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Debes estar logueado");

            const newClient = {
                ...clientData,
                userId: user.uid, // <--- AQUÍ ETIQUETAMOS EL DATO
                createdBy: user.displayName || user.email, // Para saber quién lo creó
                createdAt: new Date().toISOString(),
                status: 'Activo'
            };
            
            const docRef = await addDoc(collection(db, COLLECTION_NAME), newClient);
            return { id: docRef.id, ...newClient };
        } catch (error) {
            console.error("Error guardando cliente:", error);
            throw error;
        }
    },

    // 3. OBTENER POR ID (Seguridad extra)
    getById: async (id) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Opcional: Verificar si el dato es mío
                // if (data.userId !== auth.currentUser.uid) return null;
                return { id: docSnap.id, ...data };
            }
            return null;
        } catch (error) {
            console.error("Error buscando cliente:", error);
            return null;
        }
    },

    update: async (id, data) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, data);
            return { id, ...data };
        } catch (error) { throw error; }
    },

    delete: async (id) => {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
            return true;
        } catch (error) { return false; }
    }
};
