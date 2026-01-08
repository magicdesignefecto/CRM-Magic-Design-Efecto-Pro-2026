export const ProjectsService = {
    // Obtener todos los proyectos (Próximamente Firebase)
    getAll: async () => {
        return [];
    },

    // Crear proyecto
    create: async (data) => {
        // En Firebase se guardará con un ID único
        return data;
    },

    // Obtener por ID (con sus tareas y costos)
    getById: async (id) => {
        return null;
    },

    // Agregar Tarea a un proyecto
    addTask: async (projectId, taskData) => {
        return taskData;
    },

    // Registrar Costo/Gasto a un proyecto
    addCost: async (projectId, costData) => {
        return costData;
    }
};