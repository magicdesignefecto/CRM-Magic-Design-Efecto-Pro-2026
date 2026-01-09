import { db } from '../core/firebase-config.js';
import { collection, getCountFromServer, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const DashboardService = {
    getData: async () => {
        try {
            // 1. Contar Clientes (Rápido y eficiente usando count())
            const clientsColl = collection(db, "clients");
            const clientsSnapshot = await getCountFromServer(clientsColl);
            const totalClients = clientsSnapshot.data().count;

            // 2. Obtener Leads para calcular Totales y Recientes
            // Traemos todos para sumar dinero (si son muchos, a futuro optimizamos)
            const leadsColl = collection(db, "leads");
            const leadsSnapshot = await getDocs(leadsColl);
            const allLeads = leadsSnapshot.docs.map(doc => doc.data());

            const totalLeads = allLeads.length;
            
            // Sumar ingresos estimados (campo 'total')
            const revenue = allLeads.reduce((acc, lead) => acc + (Number(lead.total) || 0), 0);

            // 3. Obtener solo los 5 leads más recientes para la lista
            const recentLeadsQuery = query(leadsColl, orderBy("createdAt", "desc"), limit(5));
            const recentLeadsSnapshot = await getDocs(recentLeadsQuery);
            const recentLeads = recentLeadsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // 4. (Opcional) Proyectos - si aún no hay colección, retornamos 0
            let totalProjects = 0;
            try {
                const projSnapshot = await getCountFromServer(collection(db, "projects"));
                totalProjects = projSnapshot.data().count;
            } catch (e) {
                console.warn("Colección projects no existe aún");
            }

            return {
                stats: {
                    clients: totalClients,
                    leads: totalLeads,
                    projects: totalProjects,
                    revenue: revenue
                },
                recentLeads: recentLeads
            };

        } catch (error) {
            console.error("Error cargando Dashboard:", error);
            return {
                stats: { clients: 0, leads: 0, projects: 0, revenue: 0 },
                recentLeads: []
            };
        }
    }
};
