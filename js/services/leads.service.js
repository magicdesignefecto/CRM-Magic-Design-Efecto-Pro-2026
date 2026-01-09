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

const COLLECTION_NAME = 'leads';

export const LeadsService = {
    getAll: async () => {
        try {
            // Ordenamos por fecha de creación descendente (lo más nuevo primero)
            const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error obteniendo leads:", error);
            return [];
        }
    },

    create: async (leadData) => {
        try {
            const newLead = {
                ...leadData,
                createdAt: new Date().toISOString()
                // status viene del formulario, o 'Nuevo' por defecto si no lo trae
            };
            const docRef = await addDoc(collection(db, COLLECTION_NAME), newLead);
            console.log("✅ Lead guardado con ID: ", docRef.id);
            return { id: docRef.id, ...newLead };
        } catch (error) {
            console.error("Error creando lead:", error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
        } catch (error) {
            console.error("Error buscando lead:", error);
            return null;
        }
    },

    update: async (id, data) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, data);
            return { id, ...data };
        } catch (error) {
            console.error("Error actualizando lead:", error);
            throw error;
        }
    },
    
    delete: async (id) => {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
            return true;
        } catch (error) {
            console.error("Error eliminando lead:", error);
            return false;
        }
    }
};
