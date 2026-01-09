// CLAVE ÚNICA PARA LA MEMORIA DEL NAVEGADOR
const STORAGE_KEY = 'magic_crm_leads_data';

export const LeadsService = {
    // 1. OBTENER TODOS
    getAll: async () => {
        // Simulamos retardo de red
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const storedData = localStorage.getItem(STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : [];
    },

    // 2. CREAR NUEVO
    create: async (data) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const leads = await LeadsService.getAll();
        
        const newLead = {
            ...data,
            id: crypto.randomUUID(), // ID único profesional
            createdAt: new Date().toISOString(),
            // Si no viene estado, ponemos 'Nuevo' por defecto
            status: data.status || 'Nuevo' 
        };
        
        leads.push(newLead);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
        
        console.log("✅ Lead guardado:", newLead);
        return newLead;
    },

    // 3. OBTENER POR ID (Para ver detalle)
    getById: async (id) => {
        const leads = await LeadsService.getAll();
        return leads.find(l => l.id === id) || null;
    },

    // 4. ACTUALIZAR (Opcional, pero útil si editas luego)
    update: async (id, data) => {
        const leads = await LeadsService.getAll();
        const index = leads.findIndex(l => l.id === id);
        
        if (index !== -1) {
            leads[index] = { ...leads[index], ...data };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
            return leads[index];
        }
        return null;
    },

    // 5. ELIMINAR
    delete: async (id) => {
        let leads = await LeadsService.getAll();
        leads = leads.filter(l => l.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
        return true;
    }
};
