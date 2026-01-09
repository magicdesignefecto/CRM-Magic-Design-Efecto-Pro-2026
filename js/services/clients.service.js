// CLAVE ÚNICA PARA LA MEMORIA DEL NAVEGADOR
const STORAGE_KEY = 'magic_crm_clients_data';

export const ClientsService = {
    // 1. OBTENER TODOS (Leemos la memoria)
    getAll: async () => {
        // Simulamos un pequeño retraso de red para que se vea el "Cargando..."
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const storedData = localStorage.getItem(STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : [];
    },

    // 2. OBTENER UNO POR ID
    getById: async (id) => {
        const clients = await ClientsService.getAll();
        return clients.find(c => c.id === id) || null;
    },

    // 3. CREAR NUEVO (Guardamos en memoria)
    create: async (data) => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simula guardado
        
        const clients = await ClientsService.getAll();
        
        const newClient = {
            ...data,
            id: crypto.randomUUID(), // Genera un ID único profesional
            createdAt: new Date().toISOString(),
            status: 'Activo' // Por defecto
        };
        
        clients.push(newClient);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
        
        console.log("✅ Cliente guardado en LocalStorage:", newClient);
        return newClient;
    },

    // 4. ACTUALIZAR EXISTENTE
    update: async (id, data) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const clients = await ClientsService.getAll();
        const index = clients.findIndex(c => c.id === id);
        
        if (index !== -1) {
            // Mantenemos el ID y fecha original, sobrescribimos el resto
            clients[index] = { ...clients[index], ...data };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
            return clients[index];
        }
        return null;
    },

    // 5. ELIMINAR (Opcional por ahora)
    delete: async (id) => {
        let clients = await ClientsService.getAll();
        clients = clients.filter(c => c.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
        return true;
    }
};
