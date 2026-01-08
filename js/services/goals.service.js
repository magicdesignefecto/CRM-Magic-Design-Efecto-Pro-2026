export const GoalsService = {
    // Obtener metas del mes (Próximamente Firebase)
    getCurrentMonthGoals: async () => {
        // Retornamos array vacío. El módulo UI debe manejar esto creando valores por defecto (0)
        return [];
    },

    // Guardar metas
    updateGoals: async (salesTarget, leadsTarget) => {
        // Aquí irá el guardado a Firebase
        return true;
    }
};