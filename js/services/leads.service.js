// Estructura lista para integración con Backend
export const LeadsService = {
    // Obtener todos los leads
    getAll: async () => {
        // AQUÍ IRÁ LA CONEXIÓN A FIREBASE
        return []; 
    },

    // Crear nuevo lead
    create: async (data) => {
        // AQUÍ SE GUARDARÁ EN FIREBASE
        return data;
    },

    // Obtener lead por ID
    getById: async (id) => {
        // AQUÍ SE BUSCARÁ EN FIREBASE
        return null;
    }
};