import { db, auth } from '../core/firebase-config.js';
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
    where 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const COLLECTION_NAME = 'leads';

export const LeadsService = {
    getAll: async () => {
        try {
            const user = auth.currentUser;
            if (!user) return [];

            // Solo mis leads
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
            console.error("Error obteniendo leads:", error);
            return [];
        }
    },

    create: async (leadData) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("No autenticado");

            const newLead = {
                ...leadData,
                userId: user.uid, // <--- ETIQUETA DE PROPIEDAD
                createdBy: user.displayName || user.email,
                createdAt: new Date().toISOString()
            };
            const docRef = await addDoc(collection(db, COLLECTION_NAME), newLead);
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
        } catch (error) { return null; }
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
