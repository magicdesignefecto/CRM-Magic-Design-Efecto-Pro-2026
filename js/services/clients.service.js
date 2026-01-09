import { db } from '../core/firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc, 
    getDoc, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const COLLECTION_NAME = 'clients';

export const ClientsService = {
    // 1. OBTENER TODOS (Ordenados por fecha)
    getAll: async () => {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error obteniendo clientes:", error);
            return [];
        }
    },

    // 2. CREAR NUEVO
    create: async (clientData) => {
        try {
            const newClient = {
                ...clientData,
                createdAt: new Date().toISOString(),
                status: 'Activo'
            };
            const docRef = await addDoc(collection(db, COLLECTION_NAME), newClient);
            console.log("✅ Cliente guardado con ID: ", docRef.id);
            return { id: docRef.id, ...newClient };
        } catch (error) {
            console.error("Error guardando cliente:", error);
            throw error;
        }
    },

    // 3. OBTENER POR ID
    getById: async (id) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
        } catch (error) {
            console.error("Error buscando cliente:", error);
            return null;
        }
    },

    // 4. ACTUALIZAR
    update: async (id, data) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, data);
            return { id, ...data };
        } catch (error) {
            console.error("Error actualizando cliente:", error);
            throw error;
        }
    },

    // 5. ELIMINAR (Opcional)
    delete: async (id) => {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
            return true;
        } catch (error) {
            console.error("Error eliminando cliente:", error);
            return false;
        }
    }
};
