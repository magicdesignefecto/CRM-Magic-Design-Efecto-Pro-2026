// Servicios por defecto si no hay nada guardado
const DEFAULT_SERVICES = [
    "Gestión Redes Sociales",
    "Facebook/IG Ads",
    "Diseño Web",
    "Google Ads",
    "SEO",
    "Branding",
    "Desarrollo Software"
];

const getStoredServices = () => {
    const stored = localStorage.getItem('crm_services');
    return stored ? JSON.parse(stored) : DEFAULT_SERVICES;
};

export const SettingsService = {
    // Obtener lista
    getServices: async () => {
        return new Promise(resolve => {
            // Simulamos pequeña carga
            setTimeout(() => resolve(getStoredServices()), 100);
        });
    },

    // Agregar nuevo servicio
    addService: async (serviceName) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const services = getStoredServices();
                // Evitar duplicados
                if (!services.includes(serviceName) && serviceName.trim() !== "") {
                    services.push(serviceName.trim());
                    localStorage.setItem('crm_services', JSON.stringify(services));
                }
                resolve(services);
            }, 300);
        });
    },

    // Eliminar servicio
    removeService: async (serviceName) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const services = getStoredServices().filter(s => s !== serviceName);
                localStorage.setItem('crm_services', JSON.stringify(services));
                resolve(services);
            }, 300);
        });
    }
};