import { ClientsService } from './clients.service.js';
import { LeadsService } from './leads.service.js';
// Importamos otros servicios si existen, si no, usamos valores seguros
// import { ProjectsService } from './projects.service.js'; 

export const DashboardService = {
    getData: async () => {
        // Obtenemos los datos reales de los servicios que ya arreglamos
        const clients = await ClientsService.getAll();
        const leads = await LeadsService.getAll();
        
        // Calculamos totales
        const totalClients = clients.length;
        const totalLeads = leads.length;
        
        // Simulamos ingresos sumando presupuestos de leads (solo como ejemplo visual)
        // En el futuro esto vendrá de Ventas/Proyectos reales
        const revenue = leads.reduce((acc, lead) => acc + (Number(lead.total) || 0), 0);

        return {
            stats: {
                clients: totalClients,
                leads: totalLeads,
                projects: 0, // Pendiente hasta activar ProjectsService
                revenue: revenue
            },
            recentLeads: leads.slice(-5).reverse() // Los últimos 5 leads
        };
    }
};