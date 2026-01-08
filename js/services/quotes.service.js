export const QuotesService = {
    // Obtener todas las cotizaciones (Próximamente desde Firebase)
    getAll: async () => {
        return []; 
    },

    // Crear nueva cotización
    create: async (data) => {
        // Aquí se guardará en Firebase y se generará el ID autoincremental (ej: #1)
        return data;
    },

    // Obtener por ID
    getById: async (id) => {
        return null;
    }
};