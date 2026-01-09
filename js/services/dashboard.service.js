import { db, auth } from '../core/firebase-config.js';
import { collection, getCountFromServer, getDocs, query, orderBy, limit, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const DashboardService = {
    getData: async () => {
        try {
            const user = auth.currentUser;
            if (!user) return { stats: { clients: 0, leads: 0, projects: 0, revenue: 0 }, recentLeads: [] };

            // 1. Contar MIS Clientes
            const clientsColl = collection(db, "clients");
            const qClients = query(clientsColl, where("userId", "==", user.uid));
            const clientsSnapshot = await getCountFromServer(qClients);
            const totalClients = clientsSnapshot.data().count;

            // 2. Obtener MIS Leads (para sumar dinero)
            const leadsColl = collection(db, "leads");
            const qLeads = query(leadsColl, where("userId", "==", user.uid));
            const leadsSnapshot = await getDocs(qLeads);
            const allLeads = leadsSnapshot.docs.map(doc => doc.data());

            const totalLeads = allLeads.length;
            const revenue = allLeads.reduce((acc, lead) => acc + (Number(lead.total) || 0), 0);

            // 3. Obtener MIS 5 leads recientes
            const qRecent = query(
                leadsColl, 
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc"), 
                limit(5)
            );
            const recentLeadsSnapshot = await getDocs(qRecent);
            const recentLeads = recentLeadsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // 4. Proyectos (Opcional, si existieran)
            let totalProjects = 0;
            // Aquí harías lo mismo: where("userId", "==", user.uid)

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
            // Si sale error de "index", es normal la primera vez, Firebase te dará un link para crearlo.
            return {
                stats: { clients: 0, leads: 0, projects: 0, revenue: 0 },
                recentLeads: []
            };
        }
    }
};
